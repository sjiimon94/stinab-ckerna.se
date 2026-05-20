import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const BOOK_PRICE_ORE = 17900; // 179 kr in öre
const SHIPPING_ORE = 2900; // 29 kr in öre

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    // [REPLACE] Update API version if you upgrade Stripe
    apiVersion: "2026-04-22.dahlia",
  });
}

export async function POST(req: NextRequest) {
  try {
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3001";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "swish"],
      locale: "sv",
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: "Stina och mamma städar",
              description:
                "En varm och igenkännbar bilderbok om vardagslivet i en familj.",
              // [REPLACE] Update image URL when you have a real book cover hosted
              images: [`${origin}/book-cover.svg`],
            },
            unit_amount: BOOK_PRICE_ORE,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: "Frakt (Sverige)",
            },
            unit_amount: SHIPPING_ORE,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["SE"],
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        product: "stina-och-mamma-stadar",
        source: "book-site",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    if (
      error instanceof Error &&
      error.message.includes("STRIPE_SECRET_KEY is not set")
    ) {
      return NextResponse.json(
        { error: "Betalning är inte konfigurerad ännu." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Kunde inte skapa checkout-session. Försök igen." },
      { status: 500 }
    );
  }
}
