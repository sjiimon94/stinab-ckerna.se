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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Ångerrätt & retur */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-bold text-ink">Ångerrätt &amp; retur</h3>
            <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
              <p>
                Du har 14 dagars ångerrätt från det att du tagit emot boken, i
                enlighet med distansavtalslagen (SFS 2005:59). Ångerrätten
                innebär att du kan returnera varan utan att ange skäl.
              </p>
              <p className="font-semibold text-ink">Så här gör du:</p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>
                  Meddela oss inom 14 dagar från mottagandet via e-post:{" "}
                  <a
                    href="mailto:cecilia@strandevall.se"
                    className="underline hover:text-ink"
                  >
                    cecilia@strandevall.se
                  </a>
                  , eller fyll i{" "}
                  <a
                    href="https://www.konsumentverket.se/globalassets/publikationer/produkter-och-tjanster/standardblankett-for-angarande-av-avtal.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink"
                  >
                    Standardblankett för ånger (PDF)
                  </a>
                  .
                </li>
                <li>Returnera boken i ursprungligt skick (oläst, i originalskick).</li>
                <li>Du står för returfrakt.</li>
                <li>
                  Vi återbetalar bokens pris (179 kr) inom 14 dagar efter att vi
                  mottagit returen, med samma betalningsmetod som du använde vid
                  köpet. Fraktkostnaden (29 kr) återbetalas ej vid retur.
                </li>
              </ol>
            </div>
          </div>

          {/* Integritetspolicy */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-bold text-ink">Integritetspolicy (GDPR)</h3>
            <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
              <p>
                cleanconscience AB, org.nr 559163-8712, Lendahlsgatan 13, 441 31
                Alingsås är personuppgiftsansvarig.
              </p>
              <p>
                <span className="font-semibold text-ink">Vi samlar in:</span>{" "}
                namn, leveransadress, e-postadress och betalningsinformation
                (hanteras av Stripe – vi lagrar inga kortuppgifter).
              </p>
              <p>
                <span className="font-semibold text-ink">Ändamål:</span>{" "}
                Fullgöra köpeavtalet (art. 6.1.b GDPR) samt rättslig förpliktelse
                för bokföring (art. 6.1.c GDPR). Orderuppgifter sparas i 7 år
                enligt bokföringslagen (1999:1078).
              </p>
              <p>
                Vi delar uppgifter med Stripe Payments Europe Ltd (betalning) och
                postoperatör (leverans). Vi säljer aldrig dina uppgifter.
              </p>
              <p>
                Du har rätt till registerutdrag, rättelse, radering och
                dataportabilitet. Kontakta oss på{" "}
                <a
                  href="mailto:cecilia@strandevall.se"
                  className="underline hover:text-ink"
                >
                  cecilia@strandevall.se
                </a>
                . Du kan även klaga hos{" "}
                <a
                  href="https://www.imy.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ink"
                >
                  IMY (imy.se)
                </a>
                .
              </p>
            </div>
          </div>

          {/* Köpvillkor */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-bold text-ink">Köpvillkor</h3>
            <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
              <p>
                <span className="font-semibold text-ink">Säljare:</span>{" "}
                cleanconscience AB, org.nr 559163-8712, Lendahlsgatan 13, 441 31
                Alingsås.{" "}
                <a
                  href="mailto:cecilia@strandevall.se"
                  className="underline hover:text-ink"
                >
                  cecilia@strandevall.se
                </a>
              </p>
              <p>
                Alla priser anges i SEK inklusive 6% moms (fysisk bok enligt
                mervärdesskattelagen). Kvitto/orderbekräftelse skickas per
                e-post.
              </p>
              <p>
                <span className="font-semibold text-ink">Betalning:</span> Via
                Stripe Checkout – Visa och Mastercard accepteras. Swish stöds
                för närvarande inte. Avtalet träder i kraft när betalning är
                genomförd.
              </p>
              <p>
                <span className="font-semibold text-ink">Leverans:</span> Enbart
                inom Sverige, 2–5 vardagar. Fast fraktkostnad 29 kr. Du ansvarar
                för att angiven leveransadress är korrekt.
              </p>
              <p>
                Vi reserverar oss för prisändringar och eventuell tillfällig
                lagerbrist. Tillämplig lag: svensk rätt. Tvist kan hänskjutas
                till{" "}
                <a
                  href="https://www.arn.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ink"
                >
                  ARN (arn.se)
                </a>{" "}
                eller allmän domstol.
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-bold text-ink">Om cookies</h3>
            <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
              <p>
                Denna webbplats använder inga marknadsförings- eller
                spårningscookies. Eftersom inga samtyckeskrävande cookies
                används behövs ingen cookie-banner.
              </p>
              <p>
                Stripes betalningstjänst kan sätta tekniskt nödvändiga cookies
                enbart under betalningsflödet. Dessa kräver inget samtycke då de
                är nödvändiga för tjänsten.
              </p>
              <p>
                Trafikstatistik samlas in med{" "}
                <a
                  href="https://umami.is"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ink"
                >
                  Umami Analytics
                </a>
                , som är cookiefri och GDPR-kompatibel.
              </p>
            </div>
          </div>
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
