import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tack för ditt köp!",
  description: "Din beställning är bekräftad.",
};

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-24 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sage-light text-4xl">
        ✅
      </div>

      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
        Tack för ditt köp!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-ink-muted">
        Din beställning är bekräftad. En orderbekräftelse har skickats till din
        e-postadress.
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
