import Link from "next/link";
import { WaxSeal, DEFAULT_SEAL_COLOR } from "@/components/wax-seal/wax-seal";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 to-champagne-100 flex flex-col">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <WaxSeal size="sm" color={DEFAULT_SEAL_COLOR} />
          <span className="font-cormorant text-xl font-semibold text-stone-800">
            Ja, Voor Altijd
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
