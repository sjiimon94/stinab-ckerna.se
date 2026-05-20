import BuyButton from "./BuyButton";

export default function FinalCTA() {
  return (
    <section className="bg-clay-light px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-clay-dark">
          Redo att beställa?
        </span>
        <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
          Ta hem boken idag
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
          <em>Stina och mamma städar</em> – en bilderbok som värmer, engagerar
          och skapar stunder att minnas.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <BuyButton label="Köp boken – 179 kr" />
          <p className="text-sm text-ink-muted">
            179 kr + 29 kr frakt &nbsp;·&nbsp; Leverans inom Sverige &nbsp;·&nbsp; 14 dagars ångerrätt
          </p>
        </div>
      </div>
    </section>
  );
}
