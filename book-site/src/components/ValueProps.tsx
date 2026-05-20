const values = [
  {
    icon: "📖",
    title: "Igenkännbar berättelse",
    body: "En vardagsstory som träffar rätt – barn och föräldrar känner igen sig direkt.",
  },
  {
    icon: "🎨",
    title: "Vackert illustrerad",
    // [REPLACE] Update with real illustration details if desired
    body: "Livfulla illustrationer som engagerar både barn och vuxna, sida för sida.",
  },
  {
    icon: "💬",
    title: "Skapar samtal",
    body: "Väcker naturliga samtal om samarbete, gemenskap och glädje i familjen.",
  },
  {
    icon: "🚚",
    title: "Snabb leverans",
    body: "Levereras hem till dig inom 2–5 vardagar. Frakt: 29 kr, enbart inom Sverige.",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-cream px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-2xl font-bold text-ink sm:text-3xl">
          Varför den här boken?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-ink-muted">
          Fyra anledningar till varför familjer älskar{" "}
          <em>Stina och mamma städar</em>.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="lift flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {v.icon}
              </span>
              <h3 className="text-base font-bold text-ink">{v.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
