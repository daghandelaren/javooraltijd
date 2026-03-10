import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { SessionProvider } from "@/components/providers/session-provider";
import { PageTracker } from "@/components/providers/page-tracker";
import { inter, cormorant } from "@/lib/fonts";
import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Caveat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lavishly+Yours&family=Rouge+Script&family=Updock&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <PageTracker />
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
