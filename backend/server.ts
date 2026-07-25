import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { sessionConfig } from './config/session.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { db } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

async function startServer() {
  const app = express();
  const PORT = env.PORT || 5000;

  // 1. Enable trust proxy for HTTPS termination at AWS ALB / CloudFront
  app.set('trust proxy', 1);

  // 2. Strict CORS Configuration for CloudFront Frontend
  const allowedOrigins = env.CORS_ORIGIN 
    ? env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:5173'];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      
      return callback(new Error(`CORS policy blocked request from origin: ${origin}`));
    },
    credentials: true,
  }));

  // 3. Request Parsers & Session Store
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(sessionConfig);

  // 4. AWS Health Check Endpoints (for ALB Target Group)
  app.get(['/health', '/healthz', '/ping', '/api/health'], async (req, res) => {
    try {
      let dbStatus = 'ok';
      try {
        await db.execute('SELECT 1');
      } catch (err) {
        dbStatus = 'degraded';
      }

      res.status(200).json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        database: dbStatus,
        services: {
          s3Configured: Boolean(env.AWS_S3_BUCKET_NAME && env.AWS_ACCESS_KEY_ID),
        },
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message || 'Health check failed' });
    }
  });

  // 5. REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/ocr', ocrRoutes);
  app.use('/api/reports', reportRoutes);

  // 6. Standalone 404 Catch-All (No Static Files Served)
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      status: 404,
      error: 'Not Found',
      message: `API route ${req.originalUrl} does not exist on this server.`,
    });
  });

  // 7. Centralized Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Standalone Backend API running on http://0.0.0.0:${PORT}`);
  });
}

startServer();