import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-05-27.dahlia',
      appInfo: {
        name: 'Melaris',
        version: '0.1.0',
      },
    });
  }
  return _stripe;
}

// Keep backward-compatible named export (lazy proxy)
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});
