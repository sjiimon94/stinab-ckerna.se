import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import UmamiEvent from "@/components/UmamiEvent";

export const metadata: Metadata = {
  title: "Tack för ditt köp!",
  description: "Din beställning är bekräftad.",
};

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let paid = false;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    paid = session.payment_status === "paid";
  } catch {
    redirect("/");
  }

  if (!paid) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-24 text-center">
      <UmamiEvent event="purchase_completed" />

      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sage-light text-4xl">
        ✅
      </div>

      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
        Tack för ditt köp!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-ink-muted">
        Din beställning är bekräftad. En orderbekräftelse skickas till din
        e-postadress inom kort.
      </p>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">
        <em>Stina och mamma städar</em> är på väg till dig – förvänta dig
        leverans inom 2–5 vardagar. 📦
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="rounded-2xl bg-clay px-8 py-3 font-semibold text-white transition-colors hover:bg-clay-dark"
        >
          Tillbaka till startsidan
        </Link>
        <p className="text-sm text-ink-muted">
          Frågor? Skriv till{" "}
          <a
            href="mailto:cecilia@strandevall.se"
            className="underline hover:text-ink"
          >
            cecilia@strandevall.se
          </a>
          .
        </p>
      </div>
    </div>
  );
}
