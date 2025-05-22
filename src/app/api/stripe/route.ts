import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with your secret key (replace with env var in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PRICE_ID = process.env.STRIPE_PRICE_ID as string; // Use env var for price ID

export async function POST(req: NextRequest) {
  try {
    // Get the user's access token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const access_token = authHeader?.replace('Bearer ', '');
    if (!access_token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    // Get the user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const email = user.email;
    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

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
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 