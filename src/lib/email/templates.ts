// Email templates for Ja, Voor Altijd

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #44403c;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #fdf8f3;
  }
  .container {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  .logo {
    text-align: center;
    margin-bottom: 32px;
  }
  .logo-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24px;
    color: #9E1F3F;
    font-weight: 600;
  }
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 28px;
    color: #1c1917;
    margin: 0 0 16px 0;
    text-align: center;
  }
  p {
    margin: 0 0 16px 0;
  }
  .button {
    display: inline-block;
    background-color: #9E1F3F;
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: 600;
    margin: 24px 0;
  }
  .button:hover {
    background-color: #7d1832;
  }
  .center {
    text-align: center;
  }
  .footer {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e7e5e4;
    font-size: 14px;
    color: #78716c;
    text-align: center;
  }
  .small {
    font-size: 14px;
    color: #78716c;
  }
  .highlight {
    background-color: #fef3c7;
    padding: 16px;
    border-radius: 8px;
    margin: 16px 0;
  }
`;

export function magicLinkEmail(url: string, host: string): { subject: string; html: string; text: string } {
  const subject = "Inloggen bij Ja, Voor Altijd";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">Ja, Voor Altijd</span>
    </div>

    <h1>Inloggen</h1>

    <p>Klik op de onderstaande knop om in te loggen bij Ja, Voor Altijd:</p>

    <div class="center">
      <a href="${url}" class="button">Inloggen</a>
    </div>

    <p class="small">Of kopieer deze link naar je browser:</p>
    <p class="small" style="word-break: break-all;">${url}</p>

    <div class="highlight">
      <p class="small" style="margin: 0;">
        <strong>Let op:</strong> Deze link is 24 uur geldig en kan maar één keer gebruikt worden.
      </p>
    </div>

    <p class="small">
      Heb je niet geprobeerd in te loggen? Dan kun je deze e-mail veilig negeren.
    </p>

    <div class="footer">
      <p>Ja, Voor Altijd - Digitale Trouwuitnodigingen</p>
      <p>${host}</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Inloggen bij Ja, Voor Altijd

Klik op de onderstaande link om in te loggen:
${url}

Deze link is 24 uur geldig en kan maar één keer gebruikt worden.

Heb je niet geprobeerd in te loggen? Dan kun je deze e-mail veilig negeren.

---
Ja, Voor Altijd - Digitale Trouwuitnodigingen
${host}
`;

  return { subject, html, text };
}

export function rsvpNotificationEmail(
  coupleNames: string,
  guestName: string,
  attending: "YES" | "NO" | "MAYBE",
  guestCount: number,
  dietary: string | null,
  message: string | null
): { subject: string; html: string; text: string } {
  const attendingText = {
    YES: "komt naar jullie bruiloft! 🎉",
    NO: "kan helaas niet komen.",
    MAYBE: "weet het nog niet zeker.",
  };

  const subject = `Nieuwe RSVP: ${guestName} ${attending === "YES" ? "komt!" : attending === "NO" ? "kan niet komen" : "weet het nog niet"}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">Ja, Voor Altijd</span>
    </div>

    <h1>Nieuwe RSVP</h1>

    <p>Goed nieuws! Er is een nieuwe RSVP binnengekomen voor jullie uitnodiging.</p>

    <div class="highlight">
      <p style="margin: 0 0 8px 0;"><strong>${guestName}</strong></p>
      <p style="margin: 0;">${attendingText[attending]}</p>
    </div>

    ${attending === "YES" ? `
    <p><strong>Aantal personen:</strong> ${guestCount}</p>
    ${dietary ? `<p><strong>Dieetwensen:</strong> ${dietary}</p>` : ""}
    ` : ""}

    ${message ? `
    <p><strong>Bericht:</strong></p>
    <p style="font-style: italic; color: #57534e;">"${message}"</p>
    ` : ""}

    <div class="center">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Bekijk in dashboard</a>
    </div>

    <div class="footer">
      <p>Ja, Voor Altijd - Digitale Trouwuitnodigingen</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Nieuwe RSVP voor ${coupleNames}

${guestName} ${attendingText[attending]}

${attending === "YES" ? `Aantal personen: ${guestCount}` : ""}
${dietary ? `Dieetwensen: ${dietary}` : ""}
${message ? `Bericht: "${message}"` : ""}

Bekijk alle RSVP's in je dashboard:
${process.env.NEXT_PUBLIC_APP_URL}/dashboard

---
Ja, Voor Altijd - Digitale Trouwuitnodigingen
`;

  return { subject, html, text };
}

export function paymentConfirmationEmail(
  coupleNames: string,
  planName: string,
  shareUrl: string
): { subject: string; html: string; text: string } {
  const subject = "Betaling ontvangen - Jullie uitnodiging is klaar!";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">Ja, Voor Altijd</span>
    </div>

    <h1>Bedankt voor jullie bestelling! 🎉</h1>

    <p>Beste ${coupleNames},</p>

    <p>Gefeliciteerd! Jullie betaling is ontvangen en jullie digitale trouwuitnodiging is nu actief.</p>

    <div class="highlight">
      <p style="margin: 0;"><strong>Pakket:</strong> ${planName}</p>
    </div>

    <p><strong>Jullie unieke link om te delen:</strong></p>
    <p style="word-break: break-all; background: #f5f5f4; padding: 12px; border-radius: 8px; font-family: monospace;">
      ${shareUrl}
    </p>

    <div class="center">
      <a href="${shareUrl}" class="button">Bekijk uitnodiging</a>
    </div>

    <p><strong>Wat nu?</strong></p>
    <ul>
      <li>Deel de link met jullie gasten via WhatsApp, e-mail of social media</li>
      <li>Volg de RSVP's in jullie <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">dashboard</a></li>
      <li>Pas de uitnodiging aan wanneer nodig</li>
    </ul>

    <p>Hebben jullie vragen? Neem gerust contact met ons op via <a href="mailto:info@javooraltijd.nl">info@javooraltijd.nl</a>.</p>

    <p>We wensen jullie een prachtige bruiloft!</p>

    <div class="footer">
      <p>Met liefde,<br>Het team van Ja, Voor Altijd</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Bedankt voor jullie bestelling!

Beste ${coupleNames},

Gefeliciteerd! Jullie betaling is ontvangen en jullie digitale trouwuitnodiging is nu actief.

Pakket: ${planName}

Jullie unieke link om te delen:
${shareUrl}

Wat nu?
- Deel de link met jullie gasten via WhatsApp, e-mail of social media
- Volg de RSVP's in jullie dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
- Pas de uitnodiging aan wanneer nodig

Hebben jullie vragen? Neem gerust contact met ons op via info@javooraltijd.nl.

We wensen jullie een prachtige bruiloft!

Met liefde,
Het team van Ja, Voor Altijd
`;

  return { subject, html, text };
}
