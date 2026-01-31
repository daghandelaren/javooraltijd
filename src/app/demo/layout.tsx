import "@/app/globals.css";
import { Inter, Cormorant_Garamond, Caveat } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body
        className={`${inter.variable} ${cormorant.variable} ${caveat.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
