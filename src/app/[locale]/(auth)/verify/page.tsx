"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const t = useTranslations("auth.verify");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <Card className="w-full max-w-md shadow-xl border-champagne-200">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="font-cormorant text-3xl text-stone-800">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-stone-600 space-y-2">
          <span className="block">{t("subtitle")}</span>
          {email && (
            <span className="block font-medium text-stone-800">{email}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-champagne-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-olive-600 mt-0.5 shrink-0" />
            <p className="text-sm text-stone-600">
              {t("instructions")}
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-500 text-center">
          {t("spam_note")}
        </p>

        <div className="pt-4 border-t border-champagne-200">
          <Button
            asChild
            variant="outline"
            className="w-full h-12"
          >
            <Link href="/login">
              {t("try_again")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function VerifyFallback() {
  return (
    <Card className="w-full max-w-md shadow-xl border-champagne-200">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="h-8 bg-champagne-100 rounded animate-pulse" />
        <div className="h-4 bg-champagne-100 rounded w-3/4 mx-auto animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-20 bg-champagne-100 rounded animate-pulse" />
        <div className="h-12 bg-champagne-100 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  );
}
