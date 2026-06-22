# Stina och mamma städar — Dedikerad boksäljarsida

En fristående, konverteringsoptimerad försäljningssida för bilderboken
**Stina och mamma städar** av Cecilia Strandevall.

---

## Teknikstack

| Lager | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Betalning | Stripe Checkout + Stripe Webhooks |
| Databas | Supabase (PostgreSQL) |
| E-post | Resend |
| Analytics | Umami (cookiefritt, GDPR-kompatibelt) |
| Deploy | Vercel |

---

## Köra lokalt

```bash
# 1. Installera beroenden
npm install

# 2. Skapa miljövariabelfil
cp .env.local.example .env.local
# Fyll i variablerna – se avsnittet Miljövariabler nedan

# 3. Kör Supabase-schema (en gång)
# Kopiera innehållet i ../supabase/schema.sql och kör i Supabase SQL Editor

# 4. (Valfritt) Starta Stripe webhook-lyssnare lokalt
stripe listen --forward-to localhost:3000/api/webhook

# 5. Starta utvecklingsservern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

---

## Miljövariabler (`.env.local`)

| Variabel | Beskrivning | Krävs |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe Secret Key (`sk_live_...` eller `sk_test_...`) | **Ja** |
| `STRIPE_WEBHOOK_SECRET` | Webhook-hemlighet från Stripe dashboard (`whsec_...`) | **Ja** |
| `SUPABASE_URL` | Projektets URL från Supabase → Settings → API | **Ja** |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (server-side only, aldrig publik) | **Ja** |
| `RESEND_API_KEY` | API-nyckel från resend.com | **Ja** |
| `RESEND_FROM_EMAIL` | Avsändaradress (måste vara verifierad domain i Resend) | **Ja** |
| `NEXT_PUBLIC_SITE_URL` | Produktions-URL, t.ex. `https://stinabockerna.se` | **Ja** |
| `ADMIN_PASSWORD` | Lösenord för admin-panelen | **Ja** |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami Analytics website ID | Nej |

---

## Supabase-setup

### 1. Skapa projekt
1. Gå till [supabase.com](https://supabase.com) och skapa ett nytt projekt.
2. Välj region närmast dina kunder (t.ex. `eu-central-1`).

### 2. Kör schema
1. Öppna **SQL Editor** i Supabase Dashboard.
2. Klistra in och kör hela innehållet i `../supabase/schema.sql`.

Det skapar:
- Tabellen `orders` med alla fält
- Sekvensen `order_number_seq` (börjar på 1)
- Funktionen `next_order_number()` som ger `SB-YYYY-NNNN`

### 3. Hämta API-nycklar
Gå till **Project Settings → API**:
- `SUPABASE_URL` = "Project URL"
- `SUPABASE_SERVICE_ROLE_KEY` = "service_role" key (ej "anon" key)

> ⚠️ Service Role Key har full åtkomst – lägg den **aldrig** i klientkod eller git.

---

## Resend-setup

1. Skapa konto på [resend.com](https://resend.com).
2. Gå till **Domains** → lägg till och verifiera din domain (lägger till DNS-poster).
3. Gå till **API Keys** → skapa en nyckel.
4. Sätt `RESEND_FROM_EMAIL` till en adress på din verifierade domain.

---

## Stripe-setup

### Dashboard-inställningar
1. Gå till **Webhooks** → klicka "Add endpoint".
2. Endpoint URL: `https://stinabockerna.se/api/webhook`
3. Events: välj `checkout.session.completed`
4. Kopiera "Signing secret" → `STRIPE_WEBHOOK_SECRET`

> **Swish:** Swish stöds för närvarande inte och marknadsförs inte på sajten. Om du vill aktivera det framöver: gå till **Settings → Payment methods** och aktivera Swish (kräver Swedish business-konto hos Stripe). Uppdatera då betalningscopy i `HowToBuy.tsx`, `FAQ.tsx`, `PricingShipping.tsx` och `Policies.tsx`.

### Testa webhooks lokalt
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Kopiera det visade `whsec_...`-värdet till din `.env.local`.

---

## Admin-panel

URL: `/admin`

Panelen låter dig:
- Se alla beställningar sorterade med nyaste överst
- Se ordernummer (`SB-YYYY-NNNN`), datum, kundinfo, adress, antal, belopp
- Markera order som skickad (sätter automatiskt `sent_at`)
- Lägga till/redigera anteckningar per order (klicka i anteckningsfältet)

**Lösenord:** Sätt `ADMIN_PASSWORD` i miljövariabler. På Vercel: *Project → Settings → Environment Variables*.

---

## Analytics (Umami)

Projektet spårar följande händelser:

| Event | Utlöses av |
|---|---|
| Sidvisning (automatisk) | Alla sidbesök |
| `checkout_started` | Klick på köpknapp |
| `purchase_completed` | Landning på `/checkout/success` |
| `checkout_cancelled` | Landning på `/checkout/cancel` |

**Kom igång:**
1. Skapa konto på [umami.is](https://umami.is) (gratis cloud).
2. Lägg till din webbplats → kopiera Website ID.
3. Sätt `NEXT_PUBLIC_UMAMI_WEBSITE_ID` i miljövariabler.

Utan `NEXT_PUBLIC_UMAMI_WEBSITE_ID` laddas inget tracking-script.

---

## Bygga och driftsätta

```bash
npm run build   # Produktionsbygge
npm run lint    # ESLint
npm run start   # Starta produktionsserver
```

### Driftsätta på Vercel

1. Skapa nytt Vercel-projekt, importera detta repo.
2. **Root Directory**: ange `book-site`.
3. Lägg till alla miljövariabler under *Project → Settings → Environment Variables*.
4. Anslut din domain.
5. Sätt upp Stripe webhook mot din produktions-URL (se Stripe-setup ovan).

---

## Manuell setup-checklista (före launch)

### Bilder (git)
- [ ] `public/og-image.png` (1200×630 px) committad och pushad
- [ ] `public/author-photo.jpg` committad och pushad

### Supabase
- [ ] Projekt skapat i rätt region
- [ ] `supabase/schema.sql` körts i SQL Editor
- [ ] `SUPABASE_URL` och `SUPABASE_SERVICE_ROLE_KEY` tillagda i Vercel

### Stripe
- [ ] Live-nycklar (`sk_live_...`) tillagda i Vercel
- [ ] Webhook mot `https://stinabockerna.se/api/webhook` skapad
- [ ] Event `checkout.session.completed` valt
- [ ] `STRIPE_WEBHOOK_SECRET` tillagd i Vercel
- [ ] (Valfritt) Swish aktiverat – för närvarande inte aktivt på sajten

### Resend
- [ ] Domain verifierad i Resend
- [ ] `RESEND_API_KEY` tillagd i Vercel
- [ ] `RESEND_FROM_EMAIL` satt till adress på verifierad domain
- [ ] Testmail skickat och mottaget

### Umami
- [ ] Webbplats skapad i Umami
- [ ] `NEXT_PUBLIC_UMAMI_WEBSITE_ID` tillagd i Vercel

### Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` satt till `https://stinabockerna.se` (utan snedstreck)
- [ ] `ADMIN_PASSWORD` satt till ett starkt lösenord
- [ ] Domain ansluten och SSL-certifikat aktivt
- [ ] Testdeploy lyckad

---

## Launch-testplan

### Grundläggande flöde
- [ ] Besök startsidan – laddas utan fel
- [ ] Köpknapp visas med antal-väljare (standard: 1)

### Köp – 1 bok
- [ ] Klicka köpknapp → Umami `checkout_started` skickas
- [ ] Stripe Checkout öppnas med korrekt belopp (179 + 29 = 208 kr)
- [ ] Betala med testkort `4242 4242 4242 4242`
- [ ] Landning på `/checkout/success` → Umami `purchase_completed` skickas
- [ ] Webhook sparar order i Supabase med korrekt data
- [ ] Ordernummer genereras (`SB-YYYY-0001`)
- [ ] Orderbekräftelse skickas till kund-email (kontrollera inbox)
- [ ] Admin `/admin` visar ordern med rätt data

### Köp – flera böcker
- [ ] Sätt antal till 3 → knapptext uppdateras ("Köp 3 böcker – 566 kr")
- [ ] Stripe Checkout visar 3 × Stina + 1 × Frakt
- [ ] Webhook sparar `quantity: 3`
- [ ] Email visar korrekt antal

### Admin-funktioner
- [ ] Markera order som skickad → status ändras till "Skickad ✓"
- [ ] `sent_at` sätts automatiskt och visas i tabellen
- [ ] Klicka i anteckningsfältet → textfält visas
- [ ] Skriv anteckning och spara → sparas i Supabase
- [ ] Uppdatera-knappen hämtar senaste data

### Cancel-flöde
- [ ] Avbryt betalning i Stripe → landning på `/checkout/cancel`
- [ ] Umami `checkout_cancelled` skickas
- [ ] Ingen order sparas i Supabase

### Ordernummer
- [ ] Andra köpet får `SB-YYYY-0002`
- [ ] Inget ordernummer är Stripe session-ID

---

## Sidstruktur

```
/                      → Försäljningssida
/checkout/success      → Bekräftelsesida (verifierar betalning mot Stripe)
/checkout/cancel       → Avbrutet-sida
/admin                 → Admin-panel (lösenordsskyddad)
/api/checkout          → Skapar Stripe Checkout-session (POST)
/api/webhook           → Stripe webhook-mottagare (POST)
/api/admin/orders      → Hämta ordrar (GET, kräver auth)
/api/admin/orders/[id] → Uppdatera order – sent/notes (PATCH, kräver auth)
```

---

## Bildplacering

Följande filer måste finnas i `public/` **och vara committade till git** för att synas i produktion:

| Fil | Storlek | Beskrivning | Status |
|---|---|---|---|
| `public/book-cover.png` | 680×960 px | Bokomslag | ✅ finns i repo |
| `public/og-image.png` | 1200×630 px | OG-bild för sociala medier | ⚠️ måste committas |
| `public/author-photo.jpg` | 200×200 px | Författarfoto | ⚠️ måste committas |

> **Viktigt:** Det räcker inte att lägga filerna i mappen lokalt – de måste `git add`-as och pushas. Annars visas de inte på Vercel.

`author-photo.jpg` är redan kopplad i `src/components/BookDescription.tsx` – lägg bara filen i `public/`, committa och pusha så visas den automatiskt.

`og-image.png` används av Open Graph-metadata i `src/app/layout.tsx`. Utan den visas ingen bild vid delning i sociala medier.
