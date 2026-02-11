"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Globe, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();

  const otherLocale = locale === "nl" ? "en" : "nl";
  const localePath = pathname.replace(`/${locale}`, "") || "/";
  const switchLocaleHref = `/${otherLocale}${localePath}`;

  const navLinks = [
    { href: "/templates", label: t("templates") },
    { href: "/prijzen", label: t("pricing") },
    { href: "/faq", label: t("faq") },
    { href: "/over-ons", label: t("about") },
  ];

  const isActive = (href: string) => {
    const currentPath = pathname.replace(`/${locale}`, "");
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading text-xl font-semibold text-stone-900">
              Ja, Voor Altijd
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-olive-700",
                  isActive(link.href) ? "text-olive-700" : "text-stone-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Language */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={switchLocaleHref}
              className="flex items-center space-x-1 text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{otherLocale}</span>
            </Link>
            <Button asChild size="sm">
              <Link href="/builder/template">{t("start")}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                <LogIn className="h-4 w-4 mr-1.5" />
                {isAuthenticated ? t("dashboard") : t("login")}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-100"
          >
            <div className="container-wide py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors",
                    isActive(link.href) ? "text-olive-700" : "text-stone-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-stone-100">
                <Button asChild size="sm" className="w-full">
                  <Link href="/builder/template" onClick={() => setIsOpen(false)}>
                    {t("start")}
                  </Link>
                </Button>
                <div className="flex items-center justify-between">
                  <Link
                    href={switchLocaleHref}
                    className="flex items-center space-x-1 text-sm text-stone-500"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="uppercase">{otherLocale}</span>
                  </Link>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={isAuthenticated ? "/dashboard" : "/login"}
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-1.5" />
                      {isAuthenticated ? t("dashboard") : t("login")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
