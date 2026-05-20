import BuyButton from "./BuyButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <a href="/" className="font-serif text-base font-bold text-white sm:text-lg">
          Stina och mamma städar
        </a>

        {/* Navigation anchors (desktop) */}
        <nav
          className="hidden items-center gap-6 text-sm text-white/70 sm:flex"
          aria-label="Sidnavigation"
        >
          <a href="#om-boken" className="hover:text-white transition-colors">
            Om boken
          </a>
          <a href="#sa-kopar-du" className="hover:text-white transition-colors">
            Köpguide
          </a>
          <a href="#pris-frakt" className="hover:text-white transition-colors">
            Pris &amp; frakt
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* CTA */}
        <BuyButton label="Köp boken" className="py-2 px-5 text-sm" />
      </div>
    </header>
  );
}
