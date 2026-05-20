const steps = [
  {
    number: "1",
    title: "Klicka på köp-knappen",
    body: 'Tryck på "Köp boken" – du skickas direkt till vår säkra kassasida.',
  },
  {
    number: "2",
    title: "Fyll i leveransadress",
    body: "Ange din leveransadress i Sverige. Vi levererar enbart inom Sverige.",
  },
  {
    number: "3",
    title: "Betala säkert",
    body: "Välj betalningsmetod – vi accepterar kort och Swish via Stripe.",
  },
  {
    number: "4",
    title: "Boken skickas hem till dig",
    body: "Du får en orderbekräftelse per e-post. Leveranstid: 2–5 vardagar.",
  },
];

export default function HowToBuy() {
  return (
    <section id="sa-kopar-du" className="bg-cream px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-sage-dark">
            Enkelt köpflöde
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Så köper du boken
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-muted">
            Fyra enkla steg – från klick till brevlådan.
          </p>
        </div>

        <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="lift relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              {/* Step number badge */}
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-clay text-base font-bold text-white"
              >
                {step.number}
              </span>
              <h3 className="font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
