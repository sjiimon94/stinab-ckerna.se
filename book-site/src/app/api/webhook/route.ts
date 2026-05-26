import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, orderExistsByStripeSession } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency – skip if already stored
    const alreadyExists = await orderExistsByStripeSession(session.id);
    if (alreadyExists) {
      return NextResponse.json({ received: true });
    }

    const shipping = session.collected_information?.shipping_details;
    const quantity = Math.max(
      1,
      parseInt(session.metadata?.quantity ?? "1", 10) || 1
    );

    try {
      const order = await createOrder({
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

      // Send confirmation email (non-blocking – log error but don't fail)
      sendOrderConfirmation(order).catch((err) => {
        console.error("Failed to send order confirmation email:", err);
      });
    } catch (err) {
      console.error("Failed to save order to database:", err);
      // Return 500 so Stripe will retry the webhook
      return NextResponse.json(
        { error: "Failed to store order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

