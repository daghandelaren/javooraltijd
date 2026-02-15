"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, PartyPopper, HeartCrack, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type Template } from "@/lib/templates";

interface RSVPSectionProps {
  invitationId: string;
  enabled: boolean;
  deadline?: Date | null;
  template: Template;
  className?: string;
  demo?: boolean;
}

export function RSVPSection({
  invitationId,
  enabled,
  deadline,
  template,
  className,
  demo,
}: RSVPSectionProps) {
  const [showForm, setShowForm] = useState(false);

  if (!enabled) return null;

  const deadlinePassed = deadline ? new Date(deadline) < new Date() : false;
  const isBotanical = template.style === "botanical";
  const isMediterranean = template.style === "mediterranean";

  return (
    <section
      className={cn("py-16 px-4", className)}
      style={{
        background: (isBotanical || isMediterranean) ? template.colors.background : template.colors.primary,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto"
      >
        {(isBotanical || isMediterranean) ? (
          /* Botanical card-style RSVP */
          <div
            className="rounded-2xl border p-8 sm:p-10 shadow-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              borderColor: `${template.colors.primary}30`,
            }}
          >
            {!showForm ? (
              <BotanicalRSVPPrompt
                template={template}
                deadline={deadline}
                deadlinePassed={deadlinePassed}
                onShowForm={() => setShowForm(true)}
              />
            ) : (
              <BotanicalRSVPForm
                invitationId={invitationId}
                template={template}
                onClose={() => setShowForm(false)}
                demo={demo}
              />
            )}
          </div>
        ) : (
          /* Default RSVP */
          <>
            {!showForm ? (
              <RSVPPrompt
                template={template}
                deadline={deadline}
                deadlinePassed={deadlinePassed}
                onShowForm={() => setShowForm(true)}
              />
            ) : (
              <RSVPFormSection
                invitationId={invitationId}
                template={template}
                onClose={() => setShowForm(false)}
                demo={demo}
              />
            )}
          </>
        )}
      </motion.div>
    </section>
  );
}

/* ── Botanical RSVP Prompt ── */
function BotanicalRSVPPrompt({
  template,
  deadline,
  deadlinePassed,
  onShowForm,
}: {
  template: Template;
  deadline?: Date | null;
  deadlinePassed?: boolean;
  onShowForm: () => void;
}) {
  return (
    <div className="text-center">
      {/* Decorative leaf divider */}
      <div
        className="flex items-center justify-center gap-3 mb-6"
        style={{ color: template.colors.primary }}
      >
        <div className="h-px w-12" style={{ backgroundColor: template.colors.accent }} />
        <Heart className="w-5 h-5" style={{ color: template.colors.primary }} />
        <div className="h-px w-12" style={{ backgroundColor: template.colors.accent }} />
      </div>

      <h2
        className="font-heading text-2xl sm:text-3xl mb-3"
        style={{
          color: template.colors.text,
          fontFamily: `'${template.fonts.heading}', serif`,
        }}
      >
        Komen jullie ook?
      </h2>
      <p className="mb-6" style={{ color: template.colors.textMuted }}>
        Laat ons weten of je erbij bent
      </p>

      {deadline && !deadlinePassed && (
        <p className="text-sm mb-6" style={{ color: template.colors.textMuted }}>
          Reageer voor{" "}
          {new Date(deadline).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {deadlinePassed ? (
        <p className="italic" style={{ color: template.colors.textMuted }}>
          De RSVP deadline is verstreken
        </p>
      ) : (
        <Button
          onClick={onShowForm}
          size="lg"
          className="rounded-full px-8"
          style={{
            backgroundColor: template.colors.primary,
            color: "#FDFBF7",
          }}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          RSVP
        </Button>
      )}
    </div>
  );
}

/* ── Botanical RSVP Form ── */
function BotanicalRSVPForm({
  invitationId,
  template,
  onClose,
  demo,
}: {
  invitationId: string;
  template: Template;
  onClose: () => void;
  demo?: boolean;
}) {
  const [step, setStep] = useState<"attending" | "details" | "success">("attending");
  const [attending, setAttending] = useState<"YES" | "NO" | "MAYBE" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-lg border bg-white/80 focus:outline-none focus:ring-2 transition-colors"
  );

  const handleAttendingSelect = (status: "YES" | "NO" | "MAYBE") => {
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
      if (demo) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
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
      }

      setStep("success");
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${template.colors.primary}15` }}
        >
          <Heart className="w-8 h-8" style={{ color: template.colors.primary }} />
        </div>
        <h3
          className="font-heading text-2xl mb-2"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          Bedankt!
        </h3>
        <p style={{ color: template.colors.textMuted }}>
          {attending === "YES"
            ? "We kijken ernaar uit je te zien!"
            : attending === "NO"
            ? "Jammer dat je er niet bij kunt zijn."
            : "We horen graag zodra je het zeker weet!"}
        </p>
      </motion.div>
    );
  }

  if (step === "attending") {
    return (
      <div className="text-center">
        <h3
          className="font-heading text-xl mb-6"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          Kom je naar de bruiloft?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <BotanicalAttendingButton
            icon={<PartyPopper className="w-7 h-7" style={{ color: template.colors.primary }} />}
            label="Ja!"
            template={template}
            onClick={() => handleAttendingSelect("YES")}
          />
          <BotanicalAttendingButton
            icon={<HeartCrack className="w-7 h-7" style={{ color: template.colors.primary }} />}
            label="Helaas niet"
            template={template}
            onClick={() => handleAttendingSelect("NO")}
          />
          <BotanicalAttendingButton
            icon={<HelpCircle className="w-7 h-7" style={{ color: template.colors.primary }} />}
            label="Nog niet zeker"
            template={template}
            onClick={() => handleAttendingSelect("MAYBE")}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <button
        type="button"
        onClick={() => setStep("attending")}
        className="text-sm mb-2 hover:underline"
        style={{ color: template.colors.textMuted }}
      >
        &larr; Terug
      </button>

      <div>
        <label className="block text-sm mb-1 font-medium" style={{ color: template.colors.text }}>
          Naam *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClasses}
          style={{
            borderColor: `${template.colors.primary}30`,
            color: template.colors.text,
          }}
          placeholder="Je volledige naam"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium" style={{ color: template.colors.text }}>
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          style={{
            borderColor: `${template.colors.primary}30`,
            color: template.colors.text,
          }}
          placeholder="Voor bevestiging (optioneel)"
        />
      </div>

      {attending === "YES" && (
        <>
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: template.colors.text }}>
              Aantal personen
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className={inputClasses}
              style={{
                borderColor: `${template.colors.primary}30`,
                color: template.colors.text,
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "persoon" : "personen"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: template.colors.text }}>
              Dieetwensen
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className={inputClasses}
              style={{
                borderColor: `${template.colors.primary}30`,
                color: template.colors.text,
              }}
              placeholder="Vegetarisch, glutenvrij, etc."
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm mb-1 font-medium" style={{ color: template.colors.text }}>
          Bericht
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={cn(inputClasses, "resize-none")}
          style={{
            borderColor: `${template.colors.primary}30`,
            color: template.colors.text,
          }}
          placeholder="Een persoonlijk bericht (optioneel)"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 border"
          style={{
            borderColor: `${template.colors.primary}30`,
            color: template.colors.text,
          }}
        >
          Annuleren
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
          style={{
            backgroundColor: template.colors.primary,
            color: "#FDFBF7",
          }}
        >
          {isLoading ? "Versturen..." : "Verstuur"}
        </Button>
      </div>
    </motion.form>
  );
}

function BotanicalAttendingButton({
  icon,
  label,
  template,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  template: Template;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-xl border hover:shadow-md transition-all text-center bg-white/60"
      style={{ borderColor: `${template.colors.primary}30` }}
    >
      <span className="flex justify-center mb-1">{icon}</span>
      <span className="text-sm" style={{ color: template.colors.text }}>
        {label}
      </span>
    </button>
  );
}

/* ── Default (non-botanical) components ── */

function RSVPPrompt({
  template,
  deadline,
  deadlinePassed,
  onShowForm,
}: {
  template: Template;
  deadline?: Date | null;
  deadlinePassed?: boolean;
  onShowForm: () => void;
}) {
  return (
    <div className="text-center">
      <Heart className="w-10 h-10 mx-auto mb-4 text-white/40" />
      <h2
        className="font-heading text-2xl sm:text-3xl text-white mb-4"
        style={{ fontFamily: `'${template.fonts.heading}', serif` }}
      >
        Komen jullie ook?
      </h2>
      <p className="text-white/70 mb-6">
        Laat ons weten of je erbij bent
      </p>

      {deadline && !deadlinePassed && (
        <p className="text-sm text-white/50 mb-6">
          Reageer voor{" "}
          {new Date(deadline).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {deadlinePassed ? (
        <p className="text-white/70 italic">
          De RSVP deadline is verstreken
        </p>
      ) : (
        <Button
          onClick={onShowForm}
          size="lg"
          className="bg-white hover:bg-white/90"
          style={{ color: template.colors.primary }}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          RSVP
        </Button>
      )}
    </div>
  );
}

function RSVPFormSection({
  invitationId,
  template,
  onClose,
  demo,
}: {
  invitationId: string;
  template: Template;
  onClose: () => void;
  demo?: boolean;
}) {
  const [step, setStep] = useState<"attending" | "details" | "success">("attending");
  const [attending, setAttending] = useState<"YES" | "NO" | "MAYBE" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAttendingSelect = (status: "YES" | "NO" | "MAYBE") => {
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
      if (demo) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
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
      }

      setStep("success");
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-heading text-2xl text-white mb-2">Bedankt!</h3>
        <p className="text-white/70">
          {attending === "YES"
            ? "We kijken ernaar uit je te zien!"
            : attending === "NO"
            ? "Jammer dat je er niet bij kunt zijn."
            : "We horen graag zodra je het zeker weet!"}
        </p>
      </motion.div>
    );
  }

  if (step === "attending") {
    return (
      <div className="text-center">
        <h3 className="font-heading text-2xl text-white mb-6">
          Kom je naar de bruiloft?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <AttendingButton
            icon={<PartyPopper className="w-7 h-7 text-white/80" />}
            label="Ja!"
            onClick={() => handleAttendingSelect("YES")}
          />
          <AttendingButton
            icon={<HeartCrack className="w-7 h-7 text-white/80" />}
            label="Helaas niet"
            onClick={() => handleAttendingSelect("NO")}
          />
          <AttendingButton
            icon={<HelpCircle className="w-7 h-7 text-white/80" />}
            label="Nog niet zeker"
            onClick={() => handleAttendingSelect("MAYBE")}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <button
        type="button"
        onClick={() => setStep("attending")}
        className="text-white/70 hover:text-white text-sm mb-4"
      >
        &larr; Terug
      </button>

      <div>
        <label className="block text-white/80 text-sm mb-1">Naam *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
          placeholder="Je volledige naam"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
          placeholder="Voor bevestiging (optioneel)"
        />
      </div>

      {attending === "YES" && (
        <>
          <div>
            <label className="block text-white/80 text-sm mb-1">Aantal personen</label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} className="bg-stone-800">
                  {n} {n === 1 ? "persoon" : "personen"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Dieetwensen</label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              placeholder="Vegetarisch, glutenvrij, etc."
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-white/80 text-sm mb-1">Bericht</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 resize-none"
          placeholder="Een persoonlijk bericht (optioneel)"
        />
      </div>

      {error && (
        <p className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 border border-white/20 text-white hover:bg-white/10"
        >
          Annuleren
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-white hover:bg-white/90"
          style={{ color: template.colors.primary }}
        >
          {isLoading ? "Versturen..." : "Verstuur"}
        </Button>
      </div>
    </motion.form>
  );
}

function AttendingButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-center"
    >
      <span className="flex justify-center mb-1">{icon}</span>
      <span className="text-white text-sm">{label}</span>
    </button>
  );
}
