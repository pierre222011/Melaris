import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is missing');
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    
    // Retrieve the user ID and tier we stored in metadata during checkout
    const userId = session.client_reference_id || session.metadata?.userId;
    const tier = session.metadata?.tier;

    if (userId && tier) {
      // Update the user's subscription tier in Supabase
      const { error } = await supabase
        .from('users')
        .update({ subscription_tier: tier })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user subscription in DB:', error);
        return new NextResponse('Database Error', { status: 500 });
      }
      
      console.log(`Successfully upgraded user ${userId} to ${tier} tier.`);
    }
  }

  // Handle subscription cancellation
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    // We would need to look up the user by customer ID here,
    // which means we should probably store stripe_customer_id in our DB.
    // For this boilerplate, we'll keep it simple. If we stored the customer ID:
    // await supabase.from('users').update({ subscription_tier: 'free' }).eq('stripe_customer_id', subscription.customer);
    console.log('Subscription canceled:', subscription.id);
  }

  return new NextResponse('Webhook handled', { status: 200 });
}
