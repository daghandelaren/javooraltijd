import { inter, cormorant } from "@/lib/fonts";
import "@/app/globals.css";

export const metadata = {
  title: "Admin | Ja, Voor Altijd",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
