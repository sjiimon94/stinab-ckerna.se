import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, orderExistsByStripeSession } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("[webhook] POST received");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[webhook] STRIPE_SECRET_KEY is not set");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    console.error("[webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[webhook] Event received: ${event.type} (id: ${event.id})`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[webhook] checkout.session.completed – session: ${session.id}, payment_status: ${session.payment_status}`);

    // Idempotency – skip if already stored
    const alreadyExists = await orderExistsByStripeSession(session.id);
    if (alreadyExists) {
      console.log(`[webhook] Order already exists for session ${session.id} – skipping`);
      return NextResponse.json({ received: true });
    }

    const shipping = session.collected_information?.shipping_details;
    const quantity = Math.max(
      1,
      parseInt(session.metadata?.quantity ?? "1", 10) || 1
    );

    let order;
    try {
      console.log(`[webhook] Creating order for session ${session.id}`);
      order = await createOrder({
        stripe_session_id: session.id,
        customer_name: shipping?.name ?? session.customer_details?.name ?? null,
        email: session.customer_details?.email ?? null,
        phone: session.customer_details?.phone ?? null,
        quantity,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "sek",
        address_line1: shipping?.address?.line1 ?? null,
        address_line2: shipping?.address?.line2 ?? null,
        address_city: shipping?.address?.city ?? null,
        address_postal_code: shipping?.address?.postal_code ?? null,
        address_country: shipping?.address?.country ?? null,
        sent: false,
        sent_at: null,
        notes: null,
      });
      console.log(`[webhook] Order created: ${order.order_number} (id: ${order.id})`);
    } catch (err) {
      console.error("[webhook] Failed to save order to database:", err);
      // Return 500 so Stripe will retry the webhook
      return NextResponse.json(
        { error: "Failed to store order" },
        { status: 500 }
      );
    }

    // Send confirmation email (non-blocking – log error but don't fail)
    console.log(`[webhook] Starting email send for order ${order.order_number} to ${order.email ?? "(no email)"}`);
    sendOrderConfirmation(order).catch((err) => {
      console.error(`[webhook] Failed to send confirmation email for order ${order.order_number}:`, err);
    });
  }

  return NextResponse.json({ received: true });
}

