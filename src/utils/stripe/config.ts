import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-05-27.dahlia', // Updated to match the current Stripe types
  appInfo: {
    name: 'Melaris',
    version: '0.1.0',
  },
});
