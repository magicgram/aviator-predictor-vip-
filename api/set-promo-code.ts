import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROMO_CODE_KEY = 'app_config:promo_code';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { promoCode, password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 1. Check for Admin Password configuration on server
  if (!adminPassword) {
    return res.status(500).json({ success: false, message: 'Admin access is not configured on the server.' });
  }

  // 2. Validate incoming password
  if (password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Incorrect admin password.' });
  }
  
  // 3. Validate promoCode
  if (!promoCode || typeof promoCode !== 'string' || promoCode.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Promo code must be at least 3 characters long.' });
  }

  try {
    await kv.set(PROMO_CODE_KEY, promoCode.trim().toUpperCase());
    return res.status(200).json({ success: true, message: `Promo code successfully updated to: ${promoCode.trim().toUpperCase()}` });
  } catch (error) {
    console.error('[SET PROMO CODE ERROR]:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error while saving promo code.' });
  }
}
