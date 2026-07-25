import { createWorker } from 'tesseract.js';
import { GoogleGenAI } from '@google/genai';

export interface OCRParsedResult {
  merchantName: string;
  amount: number;
  date: string;
  categoryName: string;
  confidence: number;
  rawText: string;
  lineItems: Array<{ description: string; price: number }>;
}

export async function processReceiptImage(imageBuffer: Buffer, mimeType: string): Promise<OCRParsedResult> {
  // 1. Primary Engine: Google Gemini Vision (@google/genai)
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const base64Image = imageBuffer.toString('base64');
      const normalizedMime = mimeType || 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Analyze this receipt image and return ONLY a valid JSON object with these exact keys:
{
  "merchantName": "Store Name",
  "amount": 24.99,
  "date": "YYYY-MM-DD",
  "categoryName": "Food & Dining" | "Transportation" | "Utilities & Bills" | "Shopping" | "Entertainment" | "Health & Medical" | "Travel" | "General / Other",
  "lineItems": [{"description": "Item", "price": 12.50}]
}`
              },
              {
                inlineData: {
                  mimeType: normalizedMime,
                  data: base64Image
                }
              }
            ]
          }
        ],
        config: {
          systemInstruction: 'You are an AI financial receipt parser. Extract receipt metadata accurately and respond ONLY with JSON.',
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonText);

      if (parsed && typeof parsed === 'object') {
        const merchantName = typeof parsed.merchantName === 'string' && parsed.merchantName.trim()
          ? parsed.merchantName.trim()
          : 'Merchant';

        const amount = typeof parsed.amount === 'number' && !isNaN(parsed.amount)
          ? parsed.amount
          : 0;

        const date = typeof parsed.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)
          ? parsed.date
          : new Date().toISOString().split('T')[0];

        const categoryName = typeof parsed.categoryName === 'string' && parsed.categoryName.trim()
          ? parsed.categoryName.trim()
          : predictCategory(merchantName);

        const lineItems = Array.isArray(parsed.lineItems)
          ? parsed.lineItems
              .filter((item: any) => item && typeof item.description === 'string' && typeof item.price === 'number')
              .map((item: any) => ({
                description: item.description.trim(),
                price: Number(item.price)
              }))
          : [];

        return {
          merchantName,
          amount,
          date,
          categoryName,
          confidence: 0.95,
          rawText: responseText,
          lineItems
        };
      }
    } catch (geminiError) {
      console.warn('Gemini Vision OCR failed or unavailable. Falling back to Tesseract.js local OCR:', geminiError);
    }
  } else {
    console.warn('GEMINI_API_KEY environment variable is not set. Using Tesseract.js local OCR fallback.');
  }

  // 2. Fallback Engine: Tesseract.js + Regex Heuristics
  let rawText = '';
  try {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(imageBuffer);
    rawText = ret.data.text || '';
    await worker.terminate();
  } catch (tesseractError) {
    console.error('Tesseract.js OCR fallback execution error:', tesseractError);
  }

  const merchantName = extractMerchant(rawText);
  const amount = parseTotalAmount(rawText);
  const date = parseReceiptDate(rawText);
  const categoryName = predictCategory(merchantName + ' ' + rawText);
  const lineItems = extractLineItems(rawText);

  return {
    merchantName,
    amount,
    date,
    categoryName,
    confidence: rawText.trim().length > 20 ? 0.8 : 0.4,
    rawText,
    lineItems
  };
}

function extractMerchant(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return 'Store / Merchant';
  
  // Known merchants list
  const known = ['Starbucks', 'Walmart', 'Target', 'Whole Foods', 'Trader Joe', 'McDonald', 'Subway', 'Uber', 'Lyft', 'Amazon', 'Best Buy', 'CVS', 'Walgreens', 'Shell', 'Chevron', 'Home Depot'];
  for (const line of lines.slice(0, 5)) {
    for (const storeName of known) {
      if (line.toLowerCase().includes(storeName.toLowerCase())) {
        return storeName;
      }
    }
  }
  
  // Return first clean uppercase line
  for (const line of lines.slice(0, 4)) {
    if (line.length >= 3 && !/total|receipt|tax|date|amount|thank|welcome/i.test(line)) {
      return line.replace(/[^a-zA-Z0-9\s&']/g, '').trim();
    }
  }

  return lines[0].replace(/[^a-zA-Z0-9\s&']/g, '').trim() || 'Merchant';
}

function parseTotalAmount(text: string): number {
  const lines = text.split('\n');
  let highestAmount = 0;

  // Search for lines with TOTAL, AMOUNT, BALANCE, DUE
  for (const line of lines) {
    if (/total|amount|balance|due|paid/i.test(line)) {
      const matches = line.match(/\$?\s*(\d+[\.,]\d{2})/g);
      if (matches) {
        for (const m of matches) {
          const num = parseFloat(m.replace(/[\$,]/g, ''));
          if (num > highestAmount) highestAmount = num;
        }
      }
    }
  }

  if (highestAmount > 0) return highestAmount;

  // Search all monetary values
  const allMatches = text.match(/\$\s*(\d+[\.,]\d{2})/g) || text.match(/(\d+[\.,]\d{2})/g);
  if (allMatches) {
    for (const m of allMatches) {
      const num = parseFloat(m.replace(/[\$,]/g, ''));
      if (num > highestAmount && num < 10000) {
        highestAmount = num;
      }
    }
  }

  return highestAmount > 0 ? highestAmount : 15.00;
}

function parseReceiptDate(text: string): string {
  // Try YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY
  const dateRegexes = [
    /\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/,
    /\b(0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])[-/](20\d{2})\b/,
    /\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](20\d{2})\b/
  ];

  for (const regex of dateRegexes) {
    const match = text.match(regex);
    if (match) {
      if (match[1].length === 4) {
        return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
      } else if (match[3].length === 4) {
        return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
      }
    }
  }

  return new Date().toISOString().split('T')[0];
}

function predictCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/starbucks|mcdonald|subway|coffee|restaurant|cafe|food|burger|pizza|diner|kitchen/i.test(lower)) return 'Food & Dining';
  if (/uber|lyft|gas|shell|chevron|fuel|bus|train|parking|transit|taxi/i.test(lower)) return 'Transportation';
  if (/walmart|target|amazon|clothing|zara|nike|apparel|store|mall|shop/i.test(lower)) return 'Shopping';
  if (/electric|water|internet|utility|at&t|verizon|bill|mobile|power|gas/i.test(lower)) return 'Utilities & Bills';
  if (/cinema|movie|netflix|spotify|event|ticket|bowling|game/i.test(lower)) return 'Entertainment';
  if (/cvs|walgreens|pharmacy|doctor|medical|health|clinic/i.test(lower)) return 'Health & Medical';
  if (/hotel|flight|airbnb|airline|travel|resort/i.test(lower)) return 'Travel';
  
  return 'General / Other';
}

function extractLineItems(text: string): Array<{ description: string; price: number }> {
  const lines = text.split('\n');
  const items: Array<{ description: string; price: number }> = [];

  for (const line of lines) {
    const match = line.match(/^([a-zA-Z0-9\s&'-]{3,25})\s+\$?\s*(\d+\.\d{2})$/);
    if (match && !/total|subtotal|tax/i.test(match[1])) {
      items.push({
        description: match[1].trim(),
        price: parseFloat(match[2])
      });
    }
  }

  return items;
}

