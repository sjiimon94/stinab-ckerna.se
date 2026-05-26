"use client";

import { useState } from "react";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

const BOOK_PRICE_KR = 179;
const SHIPPING_KR = 29;
const MAX_QUANTITY = 10;

interface BuyButtonProps {
  /** When true, renders a compact single button without the quantity stepper (e.g. in the navbar). */
  compact?: boolean;
  className?: string;
}

export default function BuyButton({ compact = false, className = "" }: BuyButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalKr = BOOK_PRICE_KR * quantity + SHIPPING_KR;

  function changeQuantity(delta: number) {
    setQuantity((q) => Math.max(1, Math.min(MAX_QUANTITY, q + delta)));
  }

  async function handleBuy() {
    window.umami?.track("checkout_started", { quantity: compact ? 1 : quantity });
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: compact ? 1 : quantity }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Något gick fel. Försök igen.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Kunde inte ansluta. Kontrollera din anslutning och försök igen.");
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-2xl bg-clay px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-clay-dark focus:outline-none focus:ring-4 focus:ring-clay/40 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {loading ? "Skickar…" : "Köp boken"}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Quantity stepper */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-ink-muted">Antal:</span>
        <div className="flex items-center gap-0 rounded-xl border border-border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => changeQuantity(-1)}
            disabled={quantity <= 1}
            aria-label="Minska antal"
            className="flex h-9 w-9 items-center justify-center rounded-l-xl text-lg font-bold text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[2rem] select-none text-center text-sm font-bold text-ink">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => changeQuantity(1)}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Öka antal"
            className="flex h-9 w-9 items-center justify-center rounded-r-xl text-lg font-bold text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Checkout button */}
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-2xl bg-clay px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-clay-dark hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-clay/40 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Skickar till kassan…
          </span>
        ) : quantity === 1 ? (
          `Köp boken – ${totalKr} kr`
        ) : (
          `Köp ${quantity} böcker – ${totalKr} kr`
        )}
      </button>

      {quantity === 1 ? (
        <p className="text-sm text-ink-muted">
          179 kr + 29 kr frakt · Säker betalning
        </p>
      ) : (
        <p className="text-sm text-ink-muted">
          {BOOK_PRICE_KR * quantity} kr böcker + 29 kr frakt · Säker betalning
        </p>
      )}

      {error && (
        <p className="text-sm text-clay-dark" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
