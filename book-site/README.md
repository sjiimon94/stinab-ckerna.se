# Stina och mamma städar — Dedikerad boksäljarsida

En fristående, konverteringsoptimerad försäljningssida för bilderboken
**Stina och mamma städar** av Cecilia Strandevall.

---

## Teknikstack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Stripe Checkout** (betalning)
- Inga onödiga beroenden

---

## Köra lokalt

```bash
# 1. Installera beroenden
npm install

# 2. Skapa miljövariabelfil
cp .env.local.example .env.local
# Fyll i STRIPE_SECRET_KEY och NEXT_PUBLIC_SITE_URL

# 3. Starta utvecklingsservern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

---

## Miljövariabler (`.env.local`)

| Variabel | Beskrivning | Krävs |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe Secret Key (`sk_live_...` eller `sk_test_...`) | **Ja** |
| `NEXT_PUBLIC_SITE_URL` | Produktions-URL för denna sida (används för Stripe redirect-URLs) | Ja |

Utan `STRIPE_SECRET_KEY` returnerar `/api/checkout` ett felmeddelande.

---

## Bygga och driftsätta

```bash
npm run build   # Produktionsbygge
npm run lint    # ESLint
npm run start   # Starta produktionsserver
```

### Driftsätta på Vercel

1. Skapa ett nytt Vercel-projekt och importera detta repo.
2. **Root Directory**: lämna som `/` (standard — ange INTE `book-site/`).
3. Lägg till miljövariabler under *Project → Settings → Environment Variables*.
4. Anslut din domän.

---

## Ersätta platshållarinnehåll

Sök efter `[REPLACE]` i koden för att hitta alla ställen som behöver uppdateras.

### Bokomslag

Ersätt `public/book-cover.svg` med ditt riktiga omslag:

```
public/book-cover.jpg  (rekommenderat: 680×960px, JPG/PNG)
```

Uppdatera sedan bildvägen i:
- `src/components/Hero.tsx` — `src="/book-cover.svg"` → `src="/book-cover.jpg"`
- `src/components/BookDescription.tsx` — samma sak
- `src/app/api/checkout/route.ts` — `images: [...]` raden

### Bokdetaljer

| Fil | Vad du ändrar |
|---|---|
| `src/components/BookDescription.tsx` | Format, sidantal, åldersgrupp, författarbiografi |
| `src/components/ValueProps.tsx` | De 4 säljargumenten |
| `src/components/Policies.tsx` | Returpolicy, integritetspolicy, köpvillkor |
| `src/components/FAQ.tsx` | Vanliga frågor |
| `src/app/layout.tsx` | SEO-titel, -beskrivning och domän |

### Pris och frakt

Prissättning är hårdkodad i `src/app/api/checkout/route.ts`:

```ts
const BOOK_PRICE_ORE = 17900; // 179 kr
const SHIPPING_ORE = 2900;    // 29 kr
```

Uppdatera dessa om priset ändras. Uppdatera även priserna i
`src/components/PricingShipping.tsx` och `src/components/FinalCTA.tsx`.

---

## Sidstruktur

```
/                   → Försäljningssida (single-page)
/checkout/success   → Bekräftelsesida efter köp
/checkout/cancel    → Sida om betalningen avbruten
/api/checkout       → Skapar Stripe Checkout-session (POST)
```

---

## Projektstruktur

```
src/
  app/
    layout.tsx              # HTML-skal + metadata
    page.tsx                # Huvudsida (sammanfogar alla sektioner)
    globals.css             # Tailwind v4 + design-tokens
    api/checkout/route.ts   # Stripe Checkout API
    checkout/
      success/page.tsx      # Tacksida
      cancel/page.tsx       # Avbrutet-sida
  components/
    Navbar.tsx              # Sticky toppmeny med köp-CTA
    Hero.tsx                # Hero: bokomslag + hook + CTA
    ValueProps.tsx          # 4 säljargument
    BookDescription.tsx     # Bokbeskrivning + författarinfo
    HowToBuy.tsx            # 4-stegs köpguide
    PricingShipping.tsx     # Prislista + fraktinfo
    Policies.tsx            # Retur-, integritets- & köpvillkor
    FAQ.tsx                 # Vanliga frågor (HTML details/summary)
    FinalCTA.tsx            # Avslutande köp-CTA
    Footer.tsx              # Footer med kontakt
    BuyButton.tsx           # Client-komponent: initierar Stripe Checkout
public/
  book-cover.svg            # [REPLACE] med riktigt omslag
.env.local.example          # Mall för miljövariabler
package.json
tsconfig.json
next.config.ts
postcss.config.mjs
README.md
```
