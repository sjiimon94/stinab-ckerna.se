"use client";

import { useState } from "react";

interface BuyButtonProps {
  label?: string;
  className?: string;
}

export default function BuyButton({
  label = "Köp boken – 179 kr",
  className = "",
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <div className="flex flex-col items-center gap-2">
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
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="text-sm text-clay-dark" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
