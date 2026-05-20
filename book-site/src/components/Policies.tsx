/**
 * Condensed policies section.
 * [REPLACE] Review all policy text with a lawyer before publishing as legally binding.
 */
const policies = [
  {
    title: "Ångerrätt & retur",
    body: "Du har 14 dagars ångerrätt från det att du tagit emot boken, i enlighet med distansavtalslagen. Kontakta oss på cecilia@strandevall.se för att meddela att du vill returnera. Varan ska vara i obrutet skick. Återbetalning sker inom 14 dagar efter att vi tagit emot returen, med samma betalningsmetod som användes vid köpet.",
  },
  {
    title: "Integritetspolicy",
    // [REPLACE] Update with your full GDPR-compliant privacy policy text
    body: "Dina personuppgifter (namn, adress, e-post) behandlas enbart för att genomföra ditt köp och skicka din beställning. Vi delar inte dina uppgifter med tredje part utöver betalnings- och fraktleverantörer. Läs vår fullständiga integritetspolicy för mer information. [REPLACE: lägg till länk till fullständig policy]",
  },
  {
    title: "Köpvillkor",
    // [REPLACE] Update with your full terms of purchase
    body: "Köp sker i svenska kronor (SEK). Priset som visas inkluderar moms. Betalning sker via Stripe Checkout (kort eller Swish). Du får en orderbekräftelse per e-post. Vi reserverar oss för eventuella prisjusteringar och tillfälliga lagerbristsituationer. [REPLACE: komplettera med fullständiga villkor]",
  },
];

export default function Policies() {
  return (
    <section id="villkor" className="bg-cream px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-sage-dark">
            Villkor &amp; policyer
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Trygg handel
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-muted">
            Vi värnar om din trygghet. Här är det viktigaste du behöver veta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {policies.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <h3 className="mb-3 font-bold text-ink">{p.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-muted">
          Frågor? Kontakta oss på{" "}
          <a
            href="mailto:cecilia@strandevall.se"
            className="underline hover:text-ink"
          >
            cecilia@strandevall.se
          </a>
          .
        </p>
      </div>
    </section>
  );
}
