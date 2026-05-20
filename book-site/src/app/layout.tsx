import type { Metadata } from "next";
import "./globals.css";

/* ─── Site-wide metadata ─── */
// [REPLACE] Update title, description, and og:image with your real content
export const metadata: Metadata = {
  title: {
    default: "Stina och mamma städar – Bilderbok av Cecilia Strandevall",
    template: "%s | Stina och mamma städar",
  },
  description:
    "En varm och igenkännbar bilderbok om vardagslivet i en familj – om samarbete, skratt och hur vardagen kan bli något fint när man gör det tillsammans. Köp direkt online. 179 kr + 29 kr frakt.",
  openGraph: {
    title: "Stina och mamma städar – Bilderbok",
    description:
      "En varm bilderbok om samarbete, skratt och hur vardagen kan bli något fint när man gör det tillsammans.",
    locale: "sv_SE",
    type: "website",
    // [REPLACE] Set to your production URL
    url: "https://TODO_BOOK_DOMAIN",
    // [REPLACE] Add your real OG image path
    // images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
