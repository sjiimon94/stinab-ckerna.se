import Image from "next/image";
import BuyButton from "./BuyButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest px-4 py-20 sm:py-28 lg:py-36">
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-forest-light opacity-40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-sage opacity-20 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:gap-20">
        {/* Book cover */}
        <div className="w-full max-w-[280px] flex-shrink-0 sm:max-w-[320px] lg:max-w-[340px]">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            {/*
              [REPLACE] Replace /book-cover.svg with your real book cover image.
              Recommended: /book-cover.jpg at 680×960px or similar portrait ratio.
            */}
            <Image
              src="/book-cover.svg"
              alt="Bokomslag – Stina och mamma städar"
              width={340}
              height={480}
              priority
              className="block w-full"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-light">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Bilderbok
          </span>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Stina och mamma städar
          </h1>

          {/* Hook */}
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 sm:text-xl">
            En varm och igenkännbar berättelse om vardagslivet i en familj – om
            samarbete, skratt och hur vardagen kan bli något fint när man gör
            det tillsammans.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <BuyButton label="Köp boken – 179 kr" />
            <p className="mt-3 text-sm text-white/50">
              + 29 kr frakt &nbsp;·&nbsp; Leverans inom Sverige&nbsp;·&nbsp;Säker betalning
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
