import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    console.log('✅ Stripe webhook event received:', event.type);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email;
    console.log('🔔 Checkout session completed for email:', email);

    if (!email) {
      console.error('❌ No email found in checkout session.');
      return new NextResponse('No email found in session.', { status: 400 });
    }

    // Update pro_access in Supabase for this user using Supabase client
    try {
      const { error, data } = await supabase
        .from('users')
        .update({ pro_access: true })
        .eq('email', email);
      if (error) {
        throw error;
      }
      console.log(`✅ Granted pro access to user with email: ${email}`, data);
    } catch (err) {
      console.error('❌ Failed to update pro_access in Supabase:', err);
      return new NextResponse('Failed to update user access.', { status: 500 });
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
} 