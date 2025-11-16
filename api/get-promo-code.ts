import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROMO_CODE_KEY = 'app_config:promo_code';
const DEFAULT_PROMO_CODE = 'OGGY';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const promoCode = await kv.get<string>(PROMO_CODE_KEY);
    return res.status(200).json({
      success: true,
      promoCode: promoCode || DEFAULT_PROMO_CODE,
    });
  } catch (error) {
    console.error('[GET PROMO CODE ERROR]:', error);
    // On error, still return the default so the app doesn't break
    return res.status(500).json({
      success: false,
      promoCode: DEFAULT_PROMO_CODE,
      message: 'Failed to retrieve promo code from server.',
    });
  }
}
