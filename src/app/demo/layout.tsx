import { inter, cormorant } from "@/lib/fonts";
import "@/app/globals.css";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
