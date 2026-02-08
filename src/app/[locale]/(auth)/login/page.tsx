"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("auth.errors");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError(tErrors("invalid_email"));
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(tErrors("send_failed"));
      } else {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError(tErrors("default"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-champagne-200">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center mb-2">
          <Mail className="w-6 h-6 text-olive-600" />
        </div>
        <CardTitle className="font-cormorant text-3xl text-stone-800">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-stone-600">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email_label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12"
              autoComplete="email"
              autoFocus
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
            className="w-full h-12 bg-olive-600 hover:bg-olive-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              <>
                {t("submit")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-champagne-200 text-center">
          <p className="text-sm text-stone-500">
            {t("no_account")}{" "}
            <Link href="/templates" className="text-olive-600 hover:underline">
              {t("create_account")}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginFallback() {
  return (
    <Card className="w-full max-w-md shadow-xl border-champagne-200">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center mb-2">
          <Mail className="w-6 h-6 text-olive-600" />
        </div>
        <div className="h-8 bg-champagne-100 rounded animate-pulse" />
        <div className="h-4 bg-champagne-100 rounded w-3/4 mx-auto animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-12 bg-champagne-100 rounded animate-pulse" />
          <div className="h-12 bg-olive-100 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
