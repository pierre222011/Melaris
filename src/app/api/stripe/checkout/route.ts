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

    if (!tier || !['premium', 'supporter'].includes(tier)) {
      return new NextResponse('Invalid tier', { status: 400 });
    }

    // Usually you would map tiers to actual Stripe Price IDs here.
    // For this example, we'll use placeholder or dynamically created prices 
    // or tell the user to add STRIPE_PRICE_ID_PREMIUM to env.
    const priceId = tier === 'premium' 
      ? process.env.STRIPE_PRICE_ID_PREMIUM 
      : process.env.STRIPE_PRICE_ID_SUPPORTER;

    if (!priceId) {
      console.warn(`Missing Stripe Price ID for ${tier}. You need to create products in Stripe and add their Price IDs to .env.local`);
      // Fallback for development if no price is set (this will crash if actually clicked without prices)
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
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/app?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        tier
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
