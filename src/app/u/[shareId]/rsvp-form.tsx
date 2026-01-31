"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, ChevronLeft, Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  invitationId: string;
  onClose: () => void;
}

type AttendingStatus = "YES" | "NO" | "MAYBE" | null;

// Decorative flourish SVG component
function Flourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      className={cn("w-32 h-4 text-champagne-400", className)}
    >
      <path
        d="M0 10 Q 25 0, 50 10 T 100 10 T 150 10 T 200 10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <circle cx="100" cy="10" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="85" cy="10" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="115" cy="10" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

// Elegant card wrapper component
function FormCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Decorative corner accents */}
      <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-champagne-400/40 rounded-tl-lg" />
      <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-champagne-400/40 rounded-tr-lg" />
      <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-champagne-400/40 rounded-bl-lg" />
      <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-champagne-400/40 rounded-br-lg" />
      {children}
    </div>
  );
}

// Attendance option card
function AttendanceCard({
  icon,
  label,
  sublabel,
  onClick,
  delay,
}: {
  icon: string;
  label: string;
  sublabel: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "group relative p-6 rounded-2xl text-center",
        "bg-gradient-to-b from-white/15 to-white/5",
        "border border-white/20 hover:border-champagne-400/50",
        "backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-lg hover:shadow-burgundy-900/20",
        "focus:outline-none focus:ring-2 focus:ring-champagne-400/50 focus:ring-offset-2 focus:ring-offset-burgundy-700"
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-champagne-400/0 to-champagne-400/0 group-hover:from-champagne-400/10 group-hover:to-transparent transition-all duration-300" />

      {/* Sparkle accent */}
      <motion.div
        className="absolute -top-1 -right-1 text-champagne-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <div className="relative">
        <motion.span
          className="block text-4xl mb-3"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.span>
        <p className="font-heading text-lg font-semibold text-white mb-1">{label}</p>
        <p className="text-sm text-burgundy-200/80">{sublabel}</p>
      </div>
    </motion.button>
  );
}

// Elegant input styling wrapper
function ElegantInput({
  label,
  required,
  children,
  delay = 0,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="space-y-2"
    >
      <Label className="text-champagne-100 font-medium tracking-wide text-sm flex items-center gap-1">
        {label}
        {required && <span className="text-champagne-400">*</span>}
      </Label>
      {children}
    </motion.div>
  );
}

export function RSVPForm({ invitationId, onClose }: Props) {
  const [step, setStep] = useState<"attending" | "details" | "success">("attending");
  const [attending, setAttending] = useState<AttendingStatus>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAttendingSelect = (status: AttendingStatus) => {
    setAttending(status);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vul je naam in");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          name: name.trim(),
          email: email.trim() || null,
          attending,
          guestCount: attending === "YES" ? guestCount : 1,
          dietary: dietary.trim() || null,
          message: message.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Verzenden mislukt");
      }

      setStep("success");
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center py-4"
      >
        <FormCard>
          <div className="py-8 px-4">
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative w-20 h-20 mx-auto mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-500" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-champagne-300 to-champagne-400 flex items-center justify-center">
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Check className="w-10 h-10 text-burgundy-800" strokeWidth={3} />
                </motion.div>
              </div>
              {/* Decorative ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute inset-0 rounded-full border-2 border-champagne-400"
              />
            </motion.div>

            <Flourish className="mx-auto mb-4" />

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-heading text-3xl text-white mb-3"
            >
              Bedankt!
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-champagne-200 text-lg"
            >
              {attending === "YES"
                ? "We kijken ernaar uit je te zien!"
                : attending === "NO"
                ? "Jammer dat je er niet bij kunt zijn."
                : "We horen graag zodra je het zeker weet!"}
            </motion.p>

            <Flourish className="mx-auto mt-4 rotate-180" />
          </div>
        </FormCard>
      </motion.div>
    );
  }

  // Attendance selection step
  if (step === "attending") {
    return (
      <div className="py-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Flourish className="mx-auto mb-4" />
          <h3 className="font-heading text-2xl sm:text-3xl text-white mb-2">
            Kom je naar de bruiloft?
          </h3>
          <p className="text-champagne-200/80 text-sm">
            Selecteer hieronder je antwoord
          </p>
          <Flourish className="mx-auto mt-4 rotate-180" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AttendanceCard
            icon="🎉"
            label="Ja, ik kom!"
            sublabel="Ik ben erbij"
            onClick={() => handleAttendingSelect("YES")}
            delay={0.1}
          />
          <AttendanceCard
            icon="💔"
            label="Helaas niet"
            sublabel="Ik kan niet komen"
            onClick={() => handleAttendingSelect("NO")}
            delay={0.2}
          />
          <AttendanceCard
            icon="🤔"
            label="Nog niet zeker"
            sublabel="Ik laat het weten"
            onClick={() => handleAttendingSelect("MAYBE")}
            delay={0.3}
          />
        </div>
      </div>
    );
  }

  // Details form step
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="py-2"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        type="button"
        onClick={() => setStep("attending")}
        className="group flex items-center gap-2 text-champagne-200 hover:text-white text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Terug</span>
      </motion.button>

      {/* Attendance indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-3 mb-6 pb-6 border-b border-white/10"
      >
        <span className="text-2xl">
          {attending === "YES" ? "🎉" : attending === "NO" ? "💔" : "🤔"}
        </span>
        <span className="font-heading text-lg text-champagne-100">
          {attending === "YES"
            ? "Ja, ik kom!"
            : attending === "NO"
            ? "Helaas niet"
            : "Nog niet zeker"}
        </span>
      </motion.div>

      <div className="space-y-5">
        {/* Name field */}
        <ElegantInput label="Naam" required delay={0.15}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Je volledige naam"
            className={cn(
              "bg-white/10 border-white/20 text-white placeholder:text-white/40",
              "focus:border-champagne-400/50 focus:ring-champagne-400/20",
              "transition-all duration-200",
              "h-12 text-base"
            )}
            required
          />
        </ElegantInput>

        {/* Email field */}
        <ElegantInput label="E-mailadres" delay={0.2}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Voor bevestiging (optioneel)"
            className={cn(
              "bg-white/10 border-white/20 text-white placeholder:text-white/40",
              "focus:border-champagne-400/50 focus:ring-champagne-400/20",
              "transition-all duration-200",
              "h-12 text-base"
            )}
          />
        </ElegantInput>

        {/* Guest count - only for YES */}
        <AnimatePresence>
          {attending === "YES" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ElegantInput label="Aantal personen" delay={0.25}>
                <div className="flex items-center justify-center gap-4 py-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    disabled={guestCount <= 1}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      "bg-white/10 border border-white/20",
                      "hover:bg-white/20 hover:border-champagne-400/30",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-all duration-200"
                    )}
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>

                  <motion.span
                    key={guestCount}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-heading text-4xl text-champagne-100 w-16 text-center"
                  >
                    {guestCount}
                  </motion.span>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    disabled={guestCount >= 10}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      "bg-white/10 border border-white/20",
                      "hover:bg-white/20 hover:border-champagne-400/30",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-all duration-200"
                    )}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </ElegantInput>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dietary restrictions - only for YES */}
        <AnimatePresence>
          {attending === "YES" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <ElegantInput label="Dieetwensen of allergieën" delay={0.3}>
                <Input
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Vegetarisch, glutenvrij, etc."
                  className={cn(
                    "bg-white/10 border-white/20 text-white placeholder:text-white/40",
                    "focus:border-champagne-400/50 focus:ring-champagne-400/20",
                    "transition-all duration-200",
                    "h-12 text-base"
                  )}
                />
              </ElegantInput>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message field */}
        <ElegantInput label="Bericht voor het bruidspaar" delay={0.35}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Een persoonlijk bericht (optioneel)"
            rows={3}
            className={cn(
              "w-full rounded-lg px-4 py-3",
              "bg-white/10 border border-white/20 text-white placeholder:text-white/40",
              "focus:border-champagne-400/50 focus:ring-2 focus:ring-champagne-400/20 focus:outline-none",
              "transition-all duration-200",
              "resize-none text-base"
            )}
          />
        </ElegantInput>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-red-200 text-sm bg-red-500/20 p-4 rounded-lg border border-red-400/20"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 mt-8"
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className={cn(
            "flex-1 h-12",
            "border border-white/20 text-white/80",
            "hover:bg-white/10 hover:text-white hover:border-white/30",
            "transition-all duration-200"
          )}
        >
          Annuleren
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex-1 h-12",
            "bg-gradient-to-r from-champagne-400 to-champagne-500",
            "text-burgundy-900 font-semibold",
            "hover:from-champagne-300 hover:to-champagne-400",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "shadow-lg shadow-champagne-500/20"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Verstuur
            </>
          )}
        </Button>
      </motion.div>

      {/* Decorative bottom flourish */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mt-6"
      >
        <Flourish className="opacity-50" />
      </motion.div>
    </motion.form>
  );
}
