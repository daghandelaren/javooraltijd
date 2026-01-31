import { Resend } from "resend";
import {
  magicLinkEmail,
  rsvpNotificationEmail,
  paymentConfirmationEmail,
} from "./templates";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Ja, Voor Altijd <info@javooraltijd.nl>";

export async function sendMagicLinkEmail(
  to: string,
  url: string
): Promise<boolean> {
  if (!resend) {
    console.log("Email service not configured. Magic link:", url);
    return true;
  }

  const host = process.env.NEXT_PUBLIC_APP_URL || "https://javooraltijd.nl";
  const { subject, html, text } = magicLinkEmail(url, host);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send magic link email:", error);
    return false;
  }
}

export async function sendRSVPNotification(
  to: string,
  coupleNames: string,
  guestName: string,
  attending: "YES" | "NO" | "MAYBE",
  guestCount: number,
  dietary: string | null,
  message: string | null
): Promise<boolean> {
  if (!resend) {
    console.log("Email service not configured. RSVP notification skipped.");
    return true;
  }

  const { subject, html, text } = rsvpNotificationEmail(
    coupleNames,
    guestName,
    attending,
    guestCount,
    dietary,
    message
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send RSVP notification:", error);
    return false;
  }
}

export async function sendPaymentConfirmation(
  to: string,
  coupleNames: string,
  planName: string,
  shareUrl: string
): Promise<boolean> {
  if (!resend) {
    console.log("Email service not configured. Payment confirmation skipped.");
    return true;
  }

  const { subject, html, text } = paymentConfirmationEmail(
    coupleNames,
    planName,
    shareUrl
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send payment confirmation:", error);
    return false;
  }
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<boolean> {
  if (!resend) {
    console.log("Email service not configured. Contact form submission:", { name, email, subject, message });
    return true;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nieuw contactformulier bericht</title>
</head>
<body style="font-family: sans-serif; padding: 20px; color: #333;">
  <h2>Nieuw bericht via contactformulier</h2>

  <p><strong>Van:</strong> ${name} (${email})</p>
  <p><strong>Onderwerp:</strong> ${subject}</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

  <p><strong>Bericht:</strong></p>
  <p style="white-space: pre-wrap;">${message}</p>
</body>
</html>
`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: "info@javooraltijd.nl",
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html,
      text: `Nieuw bericht van ${name} (${email})\n\nOnderwerp: ${subject}\n\nBericht:\n${message}`,
    });
    return true;
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return false;
  }
}
