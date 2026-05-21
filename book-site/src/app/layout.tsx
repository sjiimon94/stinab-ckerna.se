import type { Metadata } from "next";
import "./globals.css";

/* ─── Site-wide metadata ─── */
export const metadata: Metadata = {
  title: {
    default: "Stina och mamma städar – Bilderbok av Cecilia Strandevall",
    template: "%s | Stina och mamma städar",
  },
  description:
    "En varm och igenkännbar bilderbok om vardagslivet i en familj – om samarbete, skratt och hur vardagen kan bli något fint när man gör det tillsammans. Köp direkt online. 179 kr + 29 kr frakt.",
  openGraph: {
    title: "Stina och mamma städar – Bilderbok av Cecilia Strandevall",
    description:
      "En varm bilderbok om samarbete, skratt och hur vardagen kan bli något fint när man gör det tillsammans. Inbunden, 32 sidor, för barn 3–6 år.",
    locale: "sv_SE",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://TODO_BOOK_DOMAIN",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"
  ),
  other: {
    "book:isbn": "9789181174670",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body className="bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
