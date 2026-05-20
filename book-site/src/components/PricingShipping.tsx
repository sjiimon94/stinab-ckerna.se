import BuyButton from "./BuyButton";

export default function PricingShipping() {
  return (
    <section
      id="pris-frakt"
      className="bg-forest px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-sage">
            Pris &amp; frakt
          </span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Klart och transparent
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            Inga dolda kostnader – du ser alltid det fullständiga priset innan
            du slutför ditt köp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Pricing card */}
          <div className="flex flex-col gap-5 rounded-2xl bg-forest-light p-8 ring-1 ring-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sage">
              Pris
            </h3>
            <div>
              <p className="flex items-baseline justify-between border-b border-white/10 pb-3">
                <span className="text-white/80">Stina och mamma städar</span>
                <span className="font-bold text-white">179 kr</span>
              </p>
              <p className="flex items-baseline justify-between border-b border-white/10 py-3">
                <span className="text-white/80">Frakt (Sverige)</span>
                <span className="font-bold text-white">29 kr</span>
              </p>
              <p className="flex items-baseline justify-between pt-3">
                <span className="text-base font-bold text-white">Totalt</span>
                <span className="text-2xl font-bold text-clay">208 kr</span>
              </p>
            </div>
            <BuyButton label="Köp nu – 179 kr + frakt" className="w-full" />
          </div>

          {/* Shipping details card */}
          <div className="flex flex-col gap-5 rounded-2xl bg-forest-light p-8 ring-1 ring-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sage">
              Frakt &amp; leverans
            </h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-sage"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  <strong className="text-white">Leveransområde:</strong> Enbart
                  inom Sverige.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-sage"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  <strong className="text-white">Fraktkostnad:</strong> Fast 29
                  kr per beställning – visas tydligt i kassan.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-sage"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  <strong className="text-white">Leveranstid:</strong> 2–5
                  vardagar efter bekräftad beställning.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-sage"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  <strong className="text-white">Spårning:</strong> Du får ett
                  spårningsnummer via e-post när boken är skickad.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-sage"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  <strong className="text-white">Betalning:</strong> Säkert via
                  Stripe – kort och Swish accepteras.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
