"use client";

import { useState, useEffect } from "react";

interface Address {
  line1: string | null;
  line2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

interface Order {
  id: string;
  createdAt: string;
  name: string;
  address: Address;
  email: string | null;
  quantity: number;
  amount: number;
  sent: boolean;
}

function formatAddress(addr: Address): string {
  return [addr.line1, addr.line2, addr.postal_code, addr.city, addr.country]
    .filter(Boolean)
    .join(", ");
}

function formatAmount(ore: number): string {
  return `${(ore / 100).toFixed(0)} kr`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("admin_token");
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  // Trigger a fetch whenever token changes or refreshTrigger is incremented
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      // Defer setState to avoid synchronous setState-in-effect
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;

        if (res.status === 401) {
          setError("Fel lösenord – prova igen.");
          setToken(null);
          sessionStorage.removeItem("admin_token");
          return;
        }
        if (!res.ok) throw new Error("Serverfel");
        const data: Order[] = await res.json();
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) setError("Kunde inte hämta ordrar. Försök igen.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token, fetchTick]);

  function handleRefresh() {
    setFetchTick((t) => t + 1);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin_token", password);
    setToken(password);
  }

  async function markSent(id: string) {
    if (!token) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sent: true }),
      });
      if (!res.ok) throw new Error("Fel vid uppdatering");
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, sent: true } : o))
      );
    } catch {
      setError("Kunde inte uppdatera ordern. Försök igen.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
            Admin – logga in
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-ink" htmlFor="pw">
              Lösenord
            </label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-border px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-forest"
              autoFocus
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="rounded-xl bg-forest px-6 py-3 font-semibold text-white transition-colors hover:bg-forest-light"
            >
              Logga in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-ink">
            Beställningar
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-50"
            >
              {loading ? "Laddar…" : "Uppdatera"}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setToken(null);
                setOrders([]);
              }}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-sand"
            >
              Logga ut
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && orders.length === 0 ? (
          <p className="text-ink-muted">Laddar ordrar…</p>
        ) : orders.length === 0 ? (
          <p className="text-ink-muted">Inga beställningar ännu.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-border bg-sand/40 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Namn</th>
                  <th className="px-4 py-3">Adress</th>
                  <th className="px-4 py-3">E-post</th>
                  <th className="px-4 py-3">Antal</th>
                  <th className="px-4 py-3">Belopp</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-sand/20"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {order.name || "–"}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {formatAddress(order.address) || "–"}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {order.email ? (
                        <a
                          href={`mailto:${order.email}`}
                          className="underline hover:text-ink"
                        >
                          {order.email}
                        </a>
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-ink">
                      {order.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">
                      {formatAmount(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {order.sent ? (
                        <span className="inline-flex items-center rounded-full bg-sage-light px-2.5 py-0.5 text-xs font-semibold text-sage-dark">
                          Skickad ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-clay-light px-2.5 py-0.5 text-xs font-semibold text-clay-dark">
                          Ej skickad
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!order.sent && (
                        <button
                          onClick={() => markSent(order.id)}
                          disabled={updatingId === order.id}
                          className="rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-forest-light disabled:opacity-50"
                        >
                          {updatingId === order.id
                            ? "Sparar…"
                            : "Markera skickad"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs text-ink-muted">
          Totalt {orders.length} beställning{orders.length !== 1 ? "ar" : ""} ·{" "}
          {orders.filter((o) => !o.sent).length} ej skickade
        </p>
      </div>
    </div>
  );
}
