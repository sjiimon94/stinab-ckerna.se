"use client";

import { useState, useEffect, useRef } from "react";

interface Order {
  id: string;
  order_number: string;
  stripe_session_id: string;
  created_at: string;
  customer_name: string | null;
  email: string | null;
  phone: string | null;
  quantity: number;
  amount: number;
  currency: string;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_postal_code: string | null;
  address_country: string | null;
  sent: boolean;
  sent_at: string | null;
  notes: string | null;
}

function formatAddress(order: Order): string {
  return [
    order.address_line1,
    order.address_line2,
    order.address_postal_code,
    order.address_city,
  ]
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

function NotesCell({
  order,
  token,
  onSaved,
}: {
  order: Order;
  token: string;
  onSaved: (id: string, notes: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(order.notes ?? "");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ notes: draft }),
      });
      if (!res.ok) throw new Error("Fel");
      onSaved(order.id, draft);
      setEditing(false);
    } catch {
      // keep editing open on error
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          className="w-full min-w-[160px] rounded-lg border border-border px-2 py-1 text-xs text-ink outline-none focus:ring-2 focus:ring-forest"
        />
        <div className="flex gap-1">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md bg-forest px-2 py-0.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Sparar\u2026" : "Spara"}
          </button>
          <button
            onClick={() => {
              setDraft(order.notes ?? "");
              setEditing(false);
            }}
            className="rounded-md border border-border px-2 py-0.5 text-xs text-ink-muted hover:bg-sand"
          >
            Avbryt
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="max-w-[180px] truncate text-left text-xs text-ink-muted hover:text-ink"
      title={draft || "L\u00e4gg till anteckning\u2026"}
    >
      {draft || <span className="italic opacity-50">Anteckning\u2026</span>}
    </button>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: "Bearer " + token },
        });
        if (cancelled) return;

        if (res.status === 401) {
          setError("Fel l\u00f6senord \u2013 prova igen.");
          setToken(null);
          sessionStorage.removeItem("admin_token");
          return;
        }
        if (!res.ok) throw new Error("Serverfel");
        const data: Order[] = await res.json();
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) setError("Kunde inte h\u00e4mta ordrar. F\u00f6rs\u00f6k igen.");
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
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ sent: true }),
      });
      if (!res.ok) throw new Error("Fel vid uppdatering");
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch {
      setError("Kunde inte uppdatera ordern. F\u00f6rs\u00f6k igen.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleNotesSaved(id: string, notes: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, notes } : o)));
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
            Admin \u2013 logga in
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-ink" htmlFor="pw">
              L\u00f6senord
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

  const unsentCount = orders.filter((o) => !o.sent).length;

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-ink">
            Best\u00e4llningar
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-50"
            >
              {loading ? "Laddar\u2026" : "Uppdatera"}
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
          <p className="text-ink-muted">Laddar ordrar\u2026</p>
        ) : orders.length === 0 ? (
          <p className="text-ink-muted">Inga best\u00e4llningar \u00e4nnu.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border bg-sand/40 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3">Order#</th>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Namn</th>
                  <th className="px-4 py-3">Adress</th>
                  <th className="px-4 py-3">E-post</th>
                  <th className="px-4 py-3">Antal</th>
                  <th className="px-4 py-3">Belopp</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Anteckning</th>
                  <th className="px-4 py-3">\u00c5tg\u00e4rd</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-sand/20"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-forest">
                      {order.order_number}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {order.customer_name || "\u2013"}
                      {order.phone && (
                        <span className="block text-xs text-ink-muted">
                          {order.phone}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {formatAddress(order) || "\u2013"}
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
                        "\u2013"
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
                        <div>
                          <span className="inline-flex items-center rounded-full bg-sage-light px-2.5 py-0.5 text-xs font-semibold text-sage-dark">
                            Skickad \u2713
                          </span>
                          {order.sent_at && (
                            <span className="mt-0.5 block text-xs text-ink-muted">
                              {formatDate(order.sent_at)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-clay-light px-2.5 py-0.5 text-xs font-semibold text-clay-dark">
                          Ej skickad
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <NotesCell
                        order={order}
                        token={token}
                        onSaved={handleNotesSaved}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {!order.sent && (
                        <button
                          onClick={() => markSent(order.id)}
                          disabled={updatingId === order.id}
                          className="rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-forest-light disabled:opacity-50"
                        >
                          {updatingId === order.id
                            ? "Sparar\u2026"
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
          Totalt {orders.length} best\u00e4llning{orders.length !== 1 ? "ar" : ""} \u00b7{" "}
          {unsentCount} ej skickade
        </p>
      </div>
    </div>
  );
}
