import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-narrow">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
