import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin – Stina och mamma städar",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
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
