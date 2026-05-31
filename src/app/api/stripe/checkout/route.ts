import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    const type = searchParams.get('type') || 'subscription'; // 'subscription' or 'pack'

    if (!tier) {
      return new NextResponse('Invalid tier', { status: 400 });
    }

    // Determine price ID
    let priceId = '';
    
    if (type === 'subscription') {
      priceId = tier === 'premium' 
        ? process.env.STRIPE_PRICE_ID_PREMIUM! 
        : process.env.STRIPE_PRICE_ID_PRO!;
    } else if (type === 'pack') {
      if (tier === 'starter') priceId = process.env.STRIPE_PRICE_ID_PACK_STARTER!;
      else if (tier === 'basic') priceId = process.env.STRIPE_PRICE_ID_PACK_BASIC!;
      else if (tier === 'plus') priceId = process.env.STRIPE_PRICE_ID_PACK_PLUS!;
      else if (tier === 'large') priceId = process.env.STRIPE_PRICE_ID_PACK_LARGE!;
    }

    if (!priceId) {
      console.warn(`Missing Stripe Price ID for ${tier} (${type}). Add it to .env.local`);
      return new NextResponse(`Stripe Price ID for ${tier} is not configured in .env.local`, { status: 500 });
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${request.headers.get('origin')}/app?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        action: type,
        tierOrPack: tier
      }
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }

    return new NextResponse('Error creating session', { status: 500 });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return new NextResponse(err.message, { status: err.statusCode || 500 });
  }
}
