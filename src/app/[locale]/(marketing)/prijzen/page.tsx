"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WaxSeal, DEFAULT_SEAL_COLOR } from "@/components/wax-seal/wax-seal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Diamond icon component for Signature plan
const DiamondIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M2 9h20" />
    <path d="M12 22L6 9l6-6 6 6z" />
  </svg>
);

const plans: Array<{
  id: string;
  price: number;
  icon: typeof Heart | typeof DiamondIcon;
  sealColor: string;
  accentColor: string;
  sealInitial: string;
  popular?: boolean;
  features: {
    guests: string;
    templates: boolean;
    duration: string;
    rsvpBasic: boolean;
    guestSegmentation: boolean;
    dietaryNeeds: boolean;
    extraQuestions: string | false;
    csvExport: boolean;
    notRespondedList: boolean;
    guestMessage: boolean;
    music: boolean;
  };
}> = [
  {
    id: "basic",
    price: 125,
    icon: Heart,
    sealColor: "#B0AEB0", // Parelsteen
    accentColor: "#B0AEB0",
    sealInitial: "B",
    features: {
      guests: "75",
      templates: true,
      duration: "9",
      rsvpBasic: true,
      guestSegmentation: true,
      dietaryNeeds: false,
      extraQuestions: false,
      csvExport: true,
      notRespondedList: true,
      guestMessage: false,
      music: false,
    },
  },
  {
    id: "signature",
    price: 175,
    icon: DiamondIcon,
    sealColor: DEFAULT_SEAL_COLOR, // Olijfgaard
    accentColor: DEFAULT_SEAL_COLOR,
    sealInitial: "S",
    popular: true,
    features: {
      guests: "150",
      templates: true,
      duration: "12",
      rsvpBasic: true,
      guestSegmentation: true,
      dietaryNeeds: true,
      extraQuestions: "1-2",
      csvExport: true,
      notRespondedList: true,
      guestMessage: false,
      music: true,
    },
  },
  {
    id: "premium",
    price: 225,
    icon: Sparkles,
    sealColor: "#C09878", // Koperkaramel
    accentColor: "#C09878",
    sealInitial: "P",
    features: {
      guests: "unlimited",
      templates: true,
      duration: "16",
      rsvpBasic: true,
      guestSegmentation: true,
      dietaryNeeds: true,
      extraQuestions: "unlimited",
      csvExport: true,
      notRespondedList: true,
      guestMessage: true,
      music: true,
    },
  },
];

const comparisonFeatures = [
  "guests",
  "templates",
  "duration",
  "rsvpBasic",
  "guestSegmentation",
  "dietaryNeeds",
  "extraQuestions",
  "csvExport",
  "notRespondedList",
  "guestMessage",
  "music",
];

export default function PrijzenPage() {
  const t = useTranslations("pricing");

  const getFeatureDisplay = (
    feature: string,
    value: string | boolean
  ): React.ReactNode => {
    if (feature === "guests") {
      return value === "unlimited" ? t("unlimited") : t("guestsCount", { count: value });
    }
    if (feature === "duration") {
      return t("months", { count: value });
    }
    if (feature === "extraQuestions") {
      if (value === false) return <X className="w-5 h-5 text-stone-300 mx-auto" />;
      if (value === "unlimited") return t("unlimited");
      return value;
    }
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-stone-300 mx-auto" />
      );
    }
    return value;
  };

  return (
    <main className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-champagne-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-tr from-olive-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-100 text-champagne-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {t("badge")}
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 leading-tight mb-6">
              {t("title")}
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className={cn(
                    "relative group",
                    plan.popular && "md:-mt-4 md:mb-4"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-olive-700 text-white text-sm font-medium shadow-lg">
                        <DiamondIcon className="w-3.5 h-3.5" />
                        {t("mostPopular")}
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative h-full flex flex-col rounded-2xl p-8 transition-all duration-300 overflow-hidden",
                      "bg-white border-2 shadow-lg hover:shadow-xl",
                      plan.popular && "shadow-xl shadow-olive-100/50"
                    )}
                    style={{
                      borderColor: plan.popular ? undefined : `${plan.accentColor}40`,
                      ...(plan.popular && { borderColor: "rgb(225 213 210)" }), // olive-200 equivalent
                    }}
                  >
                    {/* Decorative corner */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-full"
                      style={{
                        background: `radial-gradient(circle at 100% 0%, ${plan.accentColor} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Plan Header */}
                    <div className="flex items-start justify-between mb-6 min-h-[7rem]">
                      <div>
                        <div
                          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                          style={{ backgroundColor: `${plan.accentColor}15` }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: plan.accentColor }}
                          />
                        </div>
                        <h3 className="font-heading text-2xl font-semibold text-stone-900">
                          {t(`plans.${plan.id}.name`)}
                        </h3>
                        <p className="text-stone-500 text-sm mt-1 min-h-[2.5rem]">
                          {t(`plans.${plan.id}.description`)}
                        </p>
                      </div>
                      <WaxSeal
                        initials={plan.sealInitial}
                        color={plan.sealColor}
                        size="md"
                        initialsFontSize={40}
                        interactive={false}
                      />
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-heading font-bold text-stone-900">
                          €{plan.price}
                        </span>
                        <span className="text-stone-500">{t("oneTime")}</span>
                      </div>
                    </div>

                    {/* RSVP Feature Highlight */}
                    <div className="mb-6 p-4 rounded-xl bg-champagne-50 border border-champagne-200 min-h-[7.5rem] flex flex-col justify-center">
                      <h4 className="font-medium text-stone-900 mb-2">
                        {t(`plans.${plan.id}.rsvpTitle`)}
                      </h4>
                      <p className="text-sm text-stone-600">
                        {t(`plans.${plan.id}.rsvpFeatures`)}
                      </p>
                    </div>

                    {/* Key Features */}
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-3">
                        <Check
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accentColor }}
                        />
                        <span className="text-sm text-stone-600">
                          {plan.features.guests === "unlimited"
                            ? t("features.guestsUnlimited")
                            : t("features.guests", { value: plan.features.guests })}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accentColor }}
                        />
                        <span className="text-sm text-stone-600">
                          {t("features.templates")}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accentColor }}
                        />
                        <span className="text-sm text-stone-600">
                          {t("features.duration", { value: plan.features.duration })}
                        </span>
                      </li>
                    </ul>

                    {/* CTA */}
                    <Button
                      asChild
                      className={cn(
                        "w-full mt-auto text-white",
                        plan.popular
                          ? "bg-olive-700 hover:bg-olive-800"
                          : "hover:opacity-90"
                      )}
                      style={
                        !plan.popular
                          ? { backgroundColor: plan.accentColor }
                          : undefined
                      }
                      size="lg"
                    >
                      <Link href="/builder/template">
                        {t("selectPlan", { plan: t(`plans.${plan.id}.name`) })}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Line */}
      <section className="relative pb-16">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-stone-100 text-stone-600">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-sm font-medium">{t("trustLine")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-24 bg-champagne-50">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(212 165 116 / 0.2) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container-wide relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 mb-4">
              {t("comparison.title")}
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {t("comparison.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-champagne-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-champagne-200">
                      <th className="text-left py-5 px-6 font-heading text-lg font-semibold text-stone-900">
                        {t("comparison.features")}
                      </th>
                      {plans.map((plan) => (
                        <th
                          key={plan.id}
                          className={cn(
                            "py-5 px-6 text-center",
                            plan.popular && "bg-olive-50"
                          )}
                        >
                          <span className="font-heading text-lg font-semibold text-stone-900">
                            {t(`plans.${plan.id}.name`)}
                          </span>
                          <div className="text-sm text-stone-500 mt-1">
                            €{plan.price}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr
                        key={feature}
                        className={cn(
                          "border-b border-champagne-100 last:border-0",
                          index % 2 === 0 && "bg-champagne-50/30"
                        )}
                      >
                        <td className="py-4 px-6 text-stone-700">
                          {t(`comparison.rows.${feature}`)}
                        </td>
                        {plans.map((plan) => {
                          const featureValue =
                            plan.features[feature as keyof typeof plan.features];
                          return (
                            <td
                              key={plan.id}
                              className={cn(
                                "py-4 px-6 text-center",
                                plan.popular && "bg-olive-50/50"
                              )}
                            >
                              {getFeatureDisplay(feature, featureValue)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-champagne-50">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 mb-4">
              {t("faq.title")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {(t.raw("faq.items") as Array<{ question: string; answer: string }>).map(
                (item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-stone-900 text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-stone-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-olive-100/20 via-champagne-100/40 to-olive-100/20 rounded-3xl blur-xl" />

            <div className="relative bg-white rounded-3xl p-12 border border-champagne-200 shadow-xl">
              <WaxSeal
                initials="JA"
                color={DEFAULT_SEAL_COLOR}
                size="lg"
                interactive={false}
                className="mx-auto mb-8"
              />

              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 mb-4">
                {t("cta.title")}
              </h2>

              <p className="text-stone-600 text-lg mb-8 max-w-xl mx-auto">
                {t("cta.subtitle")}
              </p>

              <Button asChild size="lg" className="bg-olive-700 hover:bg-olive-800">
                <Link href="/builder/template">
                  {t("cta.button")}
                </Link>
              </Button>

              {/* Trust elements */}
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-stone-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Veilig via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  <span>Direct live</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
