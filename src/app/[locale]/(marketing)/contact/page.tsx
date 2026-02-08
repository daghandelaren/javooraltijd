"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Send, CheckCircle, Loader2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-stone-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact form */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-2">
                      {t("success.title")}
                    </h2>
                    <p className="text-stone-600">
                      {t("success.message")}
                    </p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="mt-6"
                    >
                      Verstuur nog een bericht
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("form.name")}</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t("form.name_placeholder")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("form.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("form.email_placeholder")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("form.subject")}</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={t("form.subject_placeholder")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t("form.message")}</Label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t("form.message_placeholder")}
                        required
                        rows={6}
                        className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-olive-600 hover:bg-olive-700"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("form.submitting")}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t("form.submit")}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-olive-600" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-stone-900">
                    {t("info.title")}
                  </h3>
                </div>
                <a
                  href={`mailto:${t("info.email")}`}
                  className="text-olive-600 hover:underline font-medium"
                >
                  {t("info.email")}
                </a>
                <p className="text-sm text-stone-500 mt-2">
                  {t("info.response_time")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-champagne-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-champagne-700" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-stone-900">
                    FAQ
                  </h3>
                </div>
                <p className="text-stone-600 text-sm mb-3">
                  Misschien staat je antwoord al in onze veelgestelde vragen.
                </p>
                <a
                  href="/#faq"
                  className="text-olive-600 hover:underline text-sm font-medium"
                >
                  Bekijk FAQ →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
