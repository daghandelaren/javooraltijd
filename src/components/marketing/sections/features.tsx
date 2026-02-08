"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Stamp,
  ClipboardCheck,
  RefreshCw,
  Leaf,
  Share2,
  LayoutDashboard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const icons = [Stamp, ClipboardCheck, RefreshCw, Leaf, Share2, LayoutDashboard];

export function FeaturesSection() {
  const t = useTranslations("home.features");

  const features = t.raw("items") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:-translate-y-1 transition-transform">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-olive-50 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-olive-700" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-stone-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
