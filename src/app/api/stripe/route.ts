import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (replace with env var in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

const PRICE_ID = 'price_1ROp1EFMxJP6Tix p9VTclFjD'; // $119 one-time

export async function POST(req: NextRequest) {
  try {
    // Optionally, you can require authentication here and get user info
    // const { user } = await getUserFromRequest(req); test

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/pricing?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
      // Optionally collect email, pass metadata, etc.
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 