-- ============================================================
-- Stina och mamma städar – Supabase schema
-- Kör detta i Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Ordrar
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT        UNIQUE NOT NULL,
  stripe_session_id   TEXT        UNIQUE NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_name       TEXT,
  email               TEXT,
  phone               TEXT,
  quantity            INTEGER     NOT NULL DEFAULT 1,
  amount              INTEGER     NOT NULL,  -- i öre (ex. 20800 = 208 kr)
  currency            TEXT        NOT NULL DEFAULT 'sek',
  address_line1       TEXT,
  address_line2       TEXT,
  address_city        TEXT,
  address_postal_code TEXT,
  address_country     TEXT,
  sent                BOOLEAN     NOT NULL DEFAULT false,
  sent_at             TIMESTAMPTZ,
  notes               TEXT
);

-- Aktivera Row Level Security (RLS)
-- API-routes använder service role key som kringgår RLS.
-- Ingen publik åtkomst tillåts.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Sekvens för ordernummer (globalt, inte per år)
-- Ger SB-YYYY-NNNN, t.ex. SB-2026-0001
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Funktion för att hämta nästa ordernummer atomärt (inga race conditions)
CREATE OR REPLACE FUNCTION next_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'SB-' || to_char(now() AT TIME ZONE 'Europe/Stockholm', 'YYYY') || '-' ||
         lpad(nextval('order_number_seq')::TEXT, 4, '0');
END;
$$;
