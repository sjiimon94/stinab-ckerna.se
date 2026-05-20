import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

interface Order {
  id: string;
  createdAt: string;
  name: string;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
  };
  email: string | null;
  quantity: number;
  amount: number;
  sent: boolean;
}

function readOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(content) as Order[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

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
    const shipping = session.collected_information?.shipping_details;
    const order: Order = {
      id: session.id,
      createdAt: new Date().toISOString(),
      name: shipping?.name ?? "",
      address: {
        line1: shipping?.address?.line1 ?? null,
        line2: shipping?.address?.line2 ?? null,
        city: shipping?.address?.city ?? null,
        postal_code: shipping?.address?.postal_code ?? null,
        country: shipping?.address?.country ?? null,
      },
      email: session.customer_details?.email ?? null,
      quantity: 1,
      amount: session.amount_total ?? 0,
      sent: false,
    };

    const orders = readOrders();
    // Avoid duplicates
    if (!orders.find((o) => o.id === order.id)) {
      orders.push(order);
      writeOrders(orders);
    }
  }

  return NextResponse.json({ received: true });
}
