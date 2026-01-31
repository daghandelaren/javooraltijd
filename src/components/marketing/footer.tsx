"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-client";

export function Footer() {
  const t = useTranslations("footer");
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: "/templates", labelKey: "templates" },
    { href: "/prijzen", labelKey: "pricing" },
    { href: "/faq", labelKey: "faq" },
  ];

  const companyLinks = [
    { href: "/over-ons", labelKey: "about" },
    { href: "/contact", labelKey: "contact" },
  ];

  const legalLinks = [
    { href: "/privacy", labelKey: "privacy" },
    { href: "/voorwaarden", labelKey: "terms" },
    { href: "/cookies", labelKey: "cookies" },
  ];

  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-semibold text-stone-900">
                Ja, Voor Altijd
              </span>
            </Link>
            <p className="mt-3 text-sm text-stone-500">{t("tagline")}</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-medium text-stone-900 text-lg mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-burgundy-700 transition-colors"
                  >
                    {t(`links.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium text-stone-900 text-lg mb-4">Bedrijf</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-burgundy-700 transition-colors"
                  >
                    {t(`links.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className="text-sm text-stone-500 hover:text-burgundy-700 transition-colors"
                >
                  {isAuthenticated ? t("links.dashboard") : t("links.login")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-medium text-stone-900 text-lg mb-4">Juridisch</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-burgundy-700 transition-colors"
                  >
                    {t(`links.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500">
            {t("copyright", { year: currentYear })}
          </p>
          <p className="text-sm text-stone-400 flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-burgundy-500 fill-burgundy-500" /> in Nederland
          </p>
        </div>
      </div>
    </footer>
  );
}
