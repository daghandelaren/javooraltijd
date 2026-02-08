import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { WaxSeal } from "@/components/wax-seal/wax-seal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <WaxSeal size="sm" color="#8EA870" />
              <span className="font-cormorant text-xl font-semibold text-stone-800">
                Ja, Voor Altijd
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-600">
                  {session.user.email}
                </span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-8">
        <div className="container-wide">{children}</div>
      </main>
    </div>
  );
}
