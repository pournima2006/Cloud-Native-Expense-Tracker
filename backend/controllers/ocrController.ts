import { Request, Response } from 'express';
import { processReceiptImage } from '../services/ocrService.js';
import { uploadToS3 } from '../services/s3Service.js';
import { db } from '../config/db.js';
import fs from 'fs';

export const scanReceipt = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a receipt image file.' });
  }

  try {
    const userId = req.session.userId!;
    const imageBuffer = req.file.buffer || (req.file.path ? fs.readFileSync(req.file.path) : Buffer.from(''));
    const mimeType = req.file.mimetype || 'image/jpeg';

    // 1. Process image with OCR engine (Tesseract.js / Gemini AI)
    const ocrResult = await processReceiptImage(imageBuffer, mimeType);

    // 2. Upload file to AWS S3 Bucket
    const imageUrl = await uploadToS3(req.file);

    // 3. Cleanup local disk temporary file if stored on disk
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn('Failed to delete temporary disk upload:', err);
      });
    }

    // Get user categories to find matching category_id
    const [categories]: any = await db.execute(
      'SELECT id, name FROM categories WHERE user_id IS NULL OR user_id = ?',
      [userId]
    );

    let matchedCategoryId = 8; // Default 'General / Other'
    if (categories && categories.length > 0) {
      const found = categories.find((c: any) => c.name.toLowerCase() === ocrResult.categoryName.toLowerCase());
      if (found) {
        matchedCategoryId = found.id;
      } else {
        matchedCategoryId = categories[0].id;
      }
    }

    return res.json({
      success: true,
      message: 'Receipt parsed and uploaded to S3 successfully.',
      extractedData: {
        merchantName: ocrResult.merchantName,
        amount: ocrResult.amount,
        date: ocrResult.date,
        category: ocrResult.categoryName,
        categoryName: ocrResult.categoryName,
        categoryId: matchedCategoryId,
        confidence: ocrResult.confidence,
        lineItems: ocrResult.lineItems,
        rawText: ocrResult.rawText,
        imageUrl: imageUrl,
        receiptUrl: imageUrl
      }
    });
  } catch (error: any) {
    console.error('OCR scanning error:', error);
    return res.status(500).json({
      success: false,
      message: 'OCR scanning failed. Please enter receipt details manually or try another image.'
    });
  }
};
