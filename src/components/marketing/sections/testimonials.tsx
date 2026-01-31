"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");

  const testimonials = t.raw("items") as Array<{
    quote: string;
    author: string;
    location: string;
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

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-champagne-50 border-champagne-100">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-burgundy-200 mb-4" />
                  <blockquote className="text-stone-700 leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-400 to-burgundy-600 flex items-center justify-center text-white text-sm font-medium">
                      {testimonial.author
                        .split(" ")[0]
                        .charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-stone-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
