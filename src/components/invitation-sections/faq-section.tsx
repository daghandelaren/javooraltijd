"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Template } from "@/lib/templates";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  template: Template;
  className?: string;
}

export function FAQSection({
  items,
  template,
  className,
}: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!items.length) return null;

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      className={cn("py-16 px-4", className)}
      style={{ background: template.colors.backgroundGradient }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h2
          className="font-heading text-2xl sm:text-3xl text-center mb-10"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          <HelpCircle className="w-6 h-6 inline-block mr-2 -mt-1" style={{ color: template.colors.primary }} />
          Veelgestelde vragen
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FAQAccordionItem
                item={item}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
                template={template}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  template,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  template: Template;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: template.style === "modern" ? "#FFFFFF" : "rgba(255,255,255,0.8)",
        border: `1px solid ${template.colors.accent}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors hover:bg-black/[0.02]"
      >
        <span
          className="font-medium"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.body}', serif`,
          }}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            className="w-5 h-5 flex-shrink-0"
            style={{ color: template.colors.textMuted }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div
              className="px-5 pb-4 text-sm"
              style={{ color: template.colors.textMuted }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
