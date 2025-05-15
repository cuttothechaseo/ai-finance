import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email;
    if (!email) {
      console.error('No email found in checkout session.');
      return new NextResponse('No email found in session.', { status: 400 });
    }

    // Update pro_access in Supabase for this user
    try {
      // Use the Supabase MCP to update the user
      await fetch(process.env.INTERNAL_MCP_URL as string + '/supabase/execute_sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'ybfbbmzztjuvpdlosfic',
          query: `UPDATE public.users SET pro_access = true WHERE email = '${email}';`
        })
      });
      console.log(`Granted pro access to user with email: ${email}`);
    } catch (err) {
      console.error('Failed to update pro_access in Supabase:', err);
      return new NextResponse('Failed to update user access.', { status: 500 });
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
} 