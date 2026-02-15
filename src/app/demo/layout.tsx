import "@/app/globals.css";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
