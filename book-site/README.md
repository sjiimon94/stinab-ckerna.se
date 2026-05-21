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
# Fyll i STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL och ADMIN_PASSWORD

# 3. (Valfritt) Starta Stripe webhook-lyssnare lokalt
stripe listen --forward-to localhost:3000/api/webhook

# 4. Starta utvecklingsservern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

---

## Miljövariabler (`.env.local`)

| Variabel | Beskrivning | Krävs |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe Secret Key (`sk_live_...` eller `sk_test_...`) | **Ja** |
| `STRIPE_WEBHOOK_SECRET` | Webhook-hemlighet från Stripe dashboard (`whsec_...`) | **Ja** |
| `NEXT_PUBLIC_SITE_URL` | Produktions-URL för denna sida (används för Stripe redirect-URLs) | Ja |
| `ADMIN_PASSWORD` | Lösenord för admin-panelen – välj ett starkt lösenord | **Ja** |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami Analytics website ID (se avsnittet Analytics nedan) | Nej |

---

## Admin-panel

URL: `/admin`

Panelen låter dig se alla beställningar och markera dem som skickade.

**Sätta lösenord:**
1. Lägg till `ADMIN_PASSWORD=ditt-starka-lösenord` i `.env.local`
2. På Vercel: lägg till variabeln under *Project → Settings → Environment Variables*

**Användning:**
- Gå till `/admin` och logga in med ditt `ADMIN_PASSWORD`
- Tabellen visar alla ordrar sorterade med nyaste överst
- Klicka "Markera skickad" när du skickat en beställning

---

## Stripe Webhooks

För att ordrar ska sparas automatiskt måste du konfigurera en webhook i Stripe dashboard.

1. Gå till [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klicka "Add endpoint"
3. Endpoint URL: `https://DIN-DOMAIN/api/webhook`
4. Events: välj `checkout.session.completed`
5. Kopiera "Signing secret" och lägg till som `STRIPE_WEBHOOK_SECRET` i din miljö

**Testa webhooks lokalt:**
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Kopiera det visade `whsec_...`-värdet till din `.env.local`.

---

## Analytics

Projektet stödjer [Umami Analytics](https://umami.is) – cookiefritt och GDPR-kompatibelt.
Ingen cookie-banner krävs.

**Kom igång med Umami Cloud (gratis, rekommenderas):**
1. Skapa konto på [umami.is](https://umami.is)
2. Klicka "Add website" och ange din domän
3. Kopiera det genererade website ID:t
4. Lägg till i `.env.local` (och på Vercel):
   ```
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=ditt-umami-webbplats-id
   ```

Utan `NEXT_PUBLIC_UMAMI_WEBSITE_ID` inläses inget tracking-script alls.

---

## Bildplacering

Cecilia ersätter bilderna manuellt. Följande filer behöver bytas ut:

| Fil | Storlek | Beskrivning |
|---|---|---|
| `public/book-cover.svg` → `public/book-cover.jpg` | 680×960 px | Bokomslag (JPG/PNG) |
| `public/og-image.png` | 1200×630 px | OG-bild för sociala medier (lägg till filen) |
| `public/author-photo.jpg` | 200×200 px (kvadrat) | Författarfoto (lägg till filen) |

När `public/author-photo.jpg` finns – sätt `author.photo = "/author-photo.jpg"` i
`src/components/BookDescription.tsx`.

Uppdatera även bildvägarna i:
- `src/components/Hero.tsx` — `src="/book-cover.svg"` → `src="/book-cover.jpg"`
- `src/components/BookDescription.tsx` — samma sak
- `src/app/api/checkout/route.ts` — `images: [...]` raden

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

## Sidstruktur

```
/                   → Försäljningssida (single-page)
/checkout/success   → Bekräftelsesida efter köp
/checkout/cancel    → Sida om betalningen avbruten
/admin              → Admin-panel (lösenordsskyddad)
/api/checkout       → Skapar Stripe Checkout-session (POST)
/api/webhook        → Stripe webhook-mottagare (POST)
/api/admin/orders   → Hämta ordrar (GET, kräver auth)
/api/admin/orders/[id] → Uppdatera orderstatus (PATCH, kräver auth)
```

---

## Projektstruktur

```
src/
  app/
    layout.tsx                     # HTML-skal + metadata
    page.tsx                       # Huvudsida (sammanfogar alla sektioner)
    globals.css                    # Tailwind v4 + design-tokens
    sitemap.ts                     # XML-sitemap
    api/
      checkout/route.ts            # Stripe Checkout API
      webhook/route.ts             # Stripe webhook-mottagare
      admin/
        orders/route.ts            # Admin: lista ordrar (GET)
        orders/[id]/route.ts       # Admin: uppdatera order (PATCH)
    checkout/
      success/page.tsx             # Tacksida (verifierar betalning mot Stripe)
      cancel/page.tsx              # Avbrutet-sida
    admin/
      layout.tsx                   # Admin-layout (ingen Navbar/Footer)
      page.tsx                     # Admin-panel UI
  components/
    Navbar.tsx                     # Sticky toppmeny med köp-CTA
    Hero.tsx                       # Hero: bokomslag + hook + CTA
    ValueProps.tsx                 # 4 säljargument
    BookDescription.tsx            # Bokbeskrivning + författarinfo
    HowToBuy.tsx                   # 4-stegs köpguide
    PricingShipping.tsx            # Prislista + fraktinfo
    Policies.tsx                   # Ångerrätt, GDPR, köpvillkor, cookies
    FAQ.tsx                        # Vanliga frågor (HTML details/summary)
    FinalCTA.tsx                   # Avslutande köp-CTA
    Footer.tsx                     # Footer med kontakt + företagsinfo
    BuyButton.tsx                  # Client-komponent: initierar Stripe Checkout
  middleware.ts                    # Skyddar /admin-routes
data/
  orders.json                      # Orderdata (gitignorerad, skapas automatiskt)
public/
  book-cover.svg                   # [REPLACE] med riktigt omslag
  robots.txt                       # SEO: robots-direktiv
.env.local.example                 # Mall för miljövariabler
package.json
tsconfig.json
next.config.ts
postcss.config.mjs
README.md
```

