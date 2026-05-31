import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { createAdminClient } from '@/utils/supabase/admin';
import { SUBSCRIPTION_PLANS, PACKS } from '@/config/economy';

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

  // 1. Prevent Replay Attacks
  const { data: existingEvent } = await supabase
    .from('stripe_events')
    .select('event_id')
    .eq('event_id', event.id)
    .single();

  if (existingEvent) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return new NextResponse('Event already processed', { status: 200 });
  }

  // 2. Mark event as processed (we do this early, if it fails later, it's safer to have missed an event than double credited, or we could handle it via DB transaction)
  await supabase.from('stripe_events').insert({ event_id: event.id });

  // 3. Handle Subscription Upgrades and Packs
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    
    const userId = session.client_reference_id || session.metadata?.userId;
    const action = session.metadata?.action; // 'subscription' or 'pack'
    const tierOrPack = session.metadata?.tierOrPack; 

    if (userId && action && tierOrPack) {
      if (action === 'subscription') {
        const plan = SUBSCRIPTION_PLANS[tierOrPack as keyof typeof SUBSCRIPTION_PLANS];
        if (plan) {
          // Update the user's subscription tier
          await supabase
            .from('users')
            .update({ subscription_tier: tierOrPack })
            .eq('id', userId);
            
          // Add the monthly melacoins directly
          await supabase.rpc('add_melacoins', {
            user_id_param: userId,
            amount_param: plan.coinsPerMonth,
            type_param: 'subscription',
            description_param: `Subscription upgraded to ${tierOrPack}`
          });
          
          console.log(`Successfully upgraded user ${userId} to ${tierOrPack} tier.`);
        }
      } else if (action === 'pack') {
        const pack = PACKS[tierOrPack as keyof typeof PACKS];
        if (pack) {
          // Add the melacoins pack
          await supabase.rpc('add_melacoins', {
            user_id_param: userId,
            amount_param: pack.coins,
            type_param: 'purchase',
            description_param: `Purchased ${tierOrPack} pack`
          });
          console.log(`Successfully credited ${pack.coins} to user ${userId}.`);
        }
      }
    }
  }
  
  // 4. Handle recurring subscription payments
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    // Stripe invoices have subscription ID, we would need to map it to user
    // Assuming metadata is passed down from subscription (requires setting up subscription metadata in Stripe)
    const subscriptionId = invoice.subscription;
    
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata?.userId;
      const tier = subscription.metadata?.tierOrPack;
      
      // Check if it's not the first invoice (because first invoice is covered by checkout.session.completed)
      if (invoice.billing_reason === 'subscription_cycle' && userId && tier) {
        const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS];
        if (plan) {
          await supabase.rpc('add_melacoins', {
            user_id_param: userId,
            amount_param: plan.coinsPerMonth,
            type_param: 'subscription',
            description_param: `Monthly subscription renewal: ${tier}`
          });
        }
      }
    }
  }

  // Handle subscription cancellation
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    const userId = subscription.metadata?.userId;
    if (userId) {
      await supabase.from('users').update({ subscription_tier: 'free' }).eq('id', userId);
      console.log('Subscription canceled for user:', userId);
    }
  }

  return new NextResponse('Webhook handled', { status: 200 });
}
