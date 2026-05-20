const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-forest px-4 py-10 text-center">
      <p className="text-sm text-white/50">
        {/* [REPLACE] Update copyright name if needed */}
        © {year} Cleanconscience &nbsp;·&nbsp;{" "}
        <a
          href="mailto:cecilia@strandevall.se"
          className="underline hover:text-white/80"
        >
          cecilia@strandevall.se
        </a>
      </p>
      <p className="mt-2 text-xs text-white/30">
        Säker betalning via Stripe &nbsp;·&nbsp; Leverans inom Sverige
      </p>
    </footer>
  );
}
