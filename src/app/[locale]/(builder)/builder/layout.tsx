"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronLeft, Save, Eye, Loader2, Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/stores/builder-store";
import { useBuilderSync } from "@/hooks/use-builder-sync";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "package", path: "/builder/package" },
  { key: "template", path: "/builder/template" },
  { key: "details", path: "/builder/details" },
  { key: "locations", path: "/builder/locations" },
  { key: "program", path: "/builder/program" },
  { key: "rsvp", path: "/builder/rsvp" },
  { key: "styling", path: "/builder/styling" },
  { key: "preview", path: "/builder/preview" },
  { key: "checkout", path: "/builder/checkout" },
];

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("builder");
  const pathname = usePathname();
  const router = useRouter();
  const { lastSaved } = useBuilderStore();
  const { isAuthenticated, isSaving, isDirty, forceSave } = useBuilderSync();

  // Get current step from pathname
  const getCurrentStepIndex = () => {
    const stepPath = pathname.split("/").pop();
    const index = STEPS.findIndex((s) => s.path.endsWith(stepPath || ""));
    return index >= 0 ? index + 1 : 1;
  };

  const activeStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            {/* Back to home */}
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Ja, Voor Altijd</span>
            </Link>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span>{t("progress", { current: activeStep, total: 9 })}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Save status indicator */}
              {isSaving && (
                <span className="text-xs text-stone-500 hidden sm:flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Opslaan...
                </span>
              )}
              {!isSaving && isDirty && (
                <span className="text-xs text-stone-400 hidden sm:flex items-center gap-1">
                  <CloudOff className="w-3 h-3" />
                  Niet opgeslagen
                </span>
              )}
              {!isSaving && !isDirty && lastSaved && (
                <span className="text-xs text-green-600 hidden sm:flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  {t("autosave")}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => forceSave()}
                disabled={isSaving || !isDirty}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">{t("save_draft")}</span>
              </Button>
              {activeStep >= 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/builder/preview")}
                >
                  <Eye className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t("steps.preview")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="bg-stone-100">
          <div className="container-wide">
            <div className="flex">
              {STEPS.map((step, index) => {
                const isActive = index + 1 === activeStep;
                const isCompleted = index + 1 < activeStep;
                const stepNumber = index + 1;

                return (
                  <Link
                    key={step.key}
                    href={step.path}
                    className={cn(
                      "flex-1 relative py-3 text-center transition-colors",
                      isActive && "bg-white",
                      !isActive && !isCompleted && "text-stone-400",
                      isCompleted && "text-burgundy-700"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                          isActive && "bg-burgundy-700 text-white",
                          isCompleted && "bg-burgundy-100 text-burgundy-700",
                          !isActive && !isCompleted && "bg-stone-200 text-stone-500"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <span className="text-xs hidden md:block">
                        {t(`steps.${step.key}`)}
                      </span>
                    </div>

                    {/* Active indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy-700"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-8">
        <div className="container-narrow">{children}</div>
      </main>
    </div>
  );
}
