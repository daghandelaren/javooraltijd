import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  return {
    title: t("title"),
  };
}

export default function TermsPage() {
  const t = useTranslations("legal.terms");

  return (
    <article className="prose prose-stone max-w-none">
      <h1 className="font-heading text-4xl font-semibold text-stone-900 mb-8">
        {t("title")}
      </h1>

      <p className="text-stone-500 text-sm mb-8">
        {t("lastUpdated")}
      </p>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.intro.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.intro.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.services.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.services.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.services.items.creation")}</li>
          <li>{t("sections.services.items.hosting")}</li>
          <li>{t("sections.services.items.rsvp")}</li>
          <li>{t("sections.services.items.sharing")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.accounts.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.accounts.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.payment.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.payment.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.payment.items.pricing")}</li>
          <li>{t("sections.payment.items.processing")}</li>
          <li>{t("sections.payment.items.refunds")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.content.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.content.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.content.items.ownership")}</li>
          <li>{t("sections.content.items.license")}</li>
          <li>{t("sections.content.items.prohibited")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.intellectual.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.intellectual.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.liability.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.liability.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.termination.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.termination.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.changes.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.changes.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.governing.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.governing.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.contact.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.contact.content")}
        </p>
        <p className="text-stone-600 mt-4">
          <a href="mailto:info@javooraltijd.nl" className="text-olive-700 hover:underline">
            info@javooraltijd.nl
          </a>
        </p>
      </section>
    </article>
  );
}
