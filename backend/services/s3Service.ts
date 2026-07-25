import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import crypto from 'crypto';
import fs from 'fs';

/**
 * Uploads an uploaded file (Express.Multer.File) to Amazon S3
 * and returns the public object URL.
 */
export async function uploadToS3(file: Express.Multer.File): Promise<string> {
  const bucketName = env.AWS_S3_BUCKET_NAME;
  const region = env.AWS_REGION || 'us-east-1';

  // If S3 credentials or bucket name are missing, fallback gracefully to data URI / local buffer
  if (!bucketName || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    console.warn('[S3 Service] AWS S3 credentials or bucket name missing. Generating fallback image URL.');
    if (file.buffer) {
      const mime = file.mimetype || 'image/jpeg';
      return `data:${mime};base64,${file.buffer.toString('base64')}`;
    }
    return `/uploads/${file.filename || 'receipt.jpg'}`;
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const extension = file.originalname ? file.originalname.split('.').pop() : 'jpg';
  const fileKey = `receipts/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`;

  let bodyBuffer: Buffer;
  if (file.buffer) {
    bodyBuffer = file.buffer;
  } else if (file.path && fs.existsSync(file.path)) {
    bodyBuffer = fs.readFileSync(file.path);
  } else {
    bodyBuffer = Buffer.from('');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: bodyBuffer,
    ContentType: file.mimetype || 'image/jpeg',
  });

  await s3Client.send(command);

  // Return full accessible S3 Object URL
  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
}
