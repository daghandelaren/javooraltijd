import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/sections/hero";
import { FeaturesSection } from "@/components/marketing/sections/features";
import { HowItWorksSection } from "@/components/marketing/sections/how-it-works";
import { WaxSealStorySection } from "@/components/marketing/sections/wax-seal-story";
import { TestimonialsSection } from "@/components/marketing/sections/testimonials";
import { FAQSection } from "@/components/marketing/sections/faq";
import { FinalCTASection } from "@/components/marketing/sections/final-cta";
import { TemplatesPreviewSection } from "@/components/marketing/sections/templates-preview";
import { ComparisonTableSection } from "@/components/marketing/sections/comparison-table";
import { DashboardPreviewSection } from "@/components/marketing/sections/dashboard-preview";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ComparisonTableSection />
      <TemplatesPreviewSection />
      <HowItWorksSection />
      <DashboardPreviewSection />
      <WaxSealStorySection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
