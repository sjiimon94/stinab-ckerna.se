import { Resend } from "resend";
import type { Order } from "./db";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
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

export async function sendOrderConfirmation(order: Order): Promise<void> {
  if (!order.email) return;

  const resend = getResend();
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@stinabockerna.se";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://stinabockerna.se";

  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orderbekräftelse</title>
</head>
<body style="font-family: Georgia, serif; background-color: #faf8f5; margin: 0; padding: 0;">
  <div style="max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2ddd6;">
    <div style="background-color: #1a2e1c; padding: 32px 40px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Stina och mamma städar</h1>
      <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 8px 0 0;">Tack för ditt köp! ✅</p>
    </div>
    <div style="padding: 32px 40px;">
      <p style="font-size: 17px; color: #2c3e2d; margin: 0 0 24px;">
        Hej ${order.customer_name ?? ""},
      </p>
      <p style="color: #6b7c6c; line-height: 1.6; margin: 0 0 24px;">
        Tack för din beställning! Vi har tagit emot den och packar boken till dig inom kort.
        Förvänta dig leverans inom <strong>2–5 vardagar</strong>.
      </p>
      <div style="background-color: #f0e8dc; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px;">
        <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7c6c; margin: 0 0 16px;">Orderdetaljer</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2c3e2d;">
          <tr>
            <td style="padding: 4px 0; color: #6b7c6c; width: 50%;">Ordernummer</td>
            <td style="padding: 4px 0; font-weight: 600;">${order.order_number}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7c6c;">Titel</td>
            <td style="padding: 4px 0;">Stina och mamma städar &times; ${order.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7c6c;">Belopp</td>
            <td style="padding: 4px 0; font-weight: 600;">${formatAmount(order.amount)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7c6c;">Leveransadress</td>
            <td style="padding: 4px 0;">${formatAddress(order) || "–"}</td>
          </tr>
        </table>
      </div>
      <p style="color: #6b7c6c; font-size: 14px; line-height: 1.6; margin: 0;">
        Frågor? Svara på detta mail eller skriv till
        <a href="mailto:cecilia@strandevall.se" style="color: #1a2e1c;">cecilia@strandevall.se</a>.
      </p>
    </div>
    <div style="border-top: 1px solid #e2ddd6; padding: 20px 40px; text-align: center;">
      <p style="font-size: 12px; color: #6b7c6c; margin: 0;">
        <a href="${siteUrl}" style="color: #1a2e1c; text-decoration: none;">${siteUrl}</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: `Stina och mamma städar <${fromEmail}>`,
    to: order.email,
    subject: `Orderbekräftelse ${order.order_number} – Stina och mamma städar`,
    html,
  });
}
