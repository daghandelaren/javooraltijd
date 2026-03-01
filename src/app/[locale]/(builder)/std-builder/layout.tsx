"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronLeft, Save, Eye, Loader2, Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStdBuilderStore } from "@/stores/std-builder-store";
import { useStdBuilderSync } from "@/hooks/use-std-builder-sync";
import { getStdTemplateById } from "@/lib/std-templates";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "template", label: "Template", path: "/std-builder/template" },
  { key: "details", label: "Details", path: "/std-builder/details" },
  { key: "styling", label: "Styling", path: "/std-builder/styling" },
  { key: "preview", label: "Preview", path: "/std-builder/preview" },
  { key: "checkout", label: "Betaling", path: "/std-builder/checkout" },
];

function getMaxAllowedStep(templateId: string | null): number {
  if (!templateId) return 1;
  return 5;
}

export default function StdBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lastSaved, templateId } = useStdBuilderStore();
  const { isSaving, isDirty, forceSave } = useStdBuilderSync();
  const selectedTemplate = templateId ? getStdTemplateById(templateId) : null;
  const primaryColor = selectedTemplate?.colors.primary ?? "#5C6B4A";
  const primaryColorLight = primaryColor + "33";

  const getCurrentStepIndex = () => {
    const stepPath = pathname.split("/").pop();
    const index = STEPS.findIndex((s) => s.path.endsWith(stepPath || ""));
    return index >= 0 ? index + 1 : 1;
  };

  const activeStep = getCurrentStepIndex();
  const maxAllowedStep = getMaxAllowedStep(templateId);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Ja, Voor Altijd</span>
            </Link>

            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full font-medium">
                Save the Date
              </span>
              <span>Stap {activeStep} van 5</span>
            </div>

            <div className="flex items-center gap-2">
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
                  Opgeslagen
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
                <span className="hidden sm:inline">Opslaan</span>
              </Button>
              {activeStep >= 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/std-builder/preview")}
                >
                  <Eye className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Preview</span>
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
                const isLocked = stepNumber > maxAllowedStep;

                if (isLocked) {
                  return (
                    <div
                      key={step.key}
                      className="flex-1 relative py-3 text-center cursor-default"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-stone-100">
                          <span className="text-xs text-stone-300">{stepNumber}</span>
                        </div>
                        <span className="text-xs hidden md:block text-stone-300">
                          {step.label}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={step.key}
                    href={step.path}
                    className={cn(
                      "flex-1 relative py-3 text-center transition-colors",
                      isActive && "bg-white",
                      !isActive && !isCompleted && "text-stone-400",
                    )}
                    style={isCompleted ? { color: primaryColor } : undefined}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                          !isActive && !isCompleted && "bg-stone-200 text-stone-500"
                        )}
                        style={
                          isActive
                            ? { backgroundColor: primaryColor, color: "#fff" }
                            : isCompleted
                            ? { backgroundColor: primaryColorLight, color: primaryColor }
                            : undefined
                        }
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <span className="text-xs hidden md:block">
                        {step.label}
                      </span>
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="activeStdStep"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: primaryColor }}
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
        <div className="container-narrow">
          {children}
        </div>
      </main>
    </div>
  );
}
