const faqs = [
  {
    q: "Var levererar ni?",
    a: "Vi levererar enbart inom Sverige.",
  },
  {
    q: "Hur lång är leveranstiden?",
    a: "Vanligtvis 2–5 vardagar efter att beställningen är bekräftad. Vid hög belastning kan det ta något längre.",
  },
  {
    q: "Kan jag returnera boken?",
    a: "Ja, du har 14 dagars ångerrätt. Kontakta oss på cecilia@strandevall.se för returinstruktioner. Varan ska vara i obrutet skick.",
  },
  {
    q: "Hur betalar jag?",
    a: "Via Stripe Checkout – vi accepterar bankkort (Visa, Mastercard m.fl.) och Swish.",
  },
  {
    q: "Får jag en orderbekräftelse?",
    a: "Ja, en orderbekräftelse skickas till din e-postadress direkt efter genomfört köp.",
  },
  {
    q: "Är mina kortuppgifter säkra?",
    a: "Betalningen hanteras helt av Stripe, en av världens ledande betalningslösningar. Vi lagrar aldrig dina kortuppgifter.",
  },
  {
    q: "Till vem passar boken?",
    // [REPLACE] Update with real target audience description
    a: "Boken riktar sig till barn i åldern 3–7 år och är perfekt som läsbok tillsammans med en förälder eller som present.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-sand/40 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-sage-dark">
            Vanliga frågor
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Har du frågor?
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-border bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-semibold text-ink hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40">
                {faq.q}
                {/* Chevron icon */}
                <svg
                  className="h-5 w-5 flex-shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-1 text-sm leading-relaxed text-ink-muted">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink-muted">
          Hittar du inte svaret?{" "}
          <a
            href="mailto:cecilia@strandevall.se"
            className="font-medium text-clay underline hover:text-clay-dark"
          >
            Kontakta oss
          </a>
          .
        </p>
      </div>
    </section>
  );
}
