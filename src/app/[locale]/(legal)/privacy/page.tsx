import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return {
    title: t("title"),
  };
}

export default function PrivacyPage() {
  const t = useTranslations("legal.privacy");

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
          {t("sections.dataCollection.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.dataCollection.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.dataCollection.items.email")}</li>
          <li>{t("sections.dataCollection.items.names")}</li>
          <li>{t("sections.dataCollection.items.weddingDetails")}</li>
          <li>{t("sections.dataCollection.items.rsvp")}</li>
          <li>{t("sections.dataCollection.items.payment")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.dataUsage.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.dataUsage.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.dataUsage.items.service")}</li>
          <li>{t("sections.dataUsage.items.communication")}</li>
          <li>{t("sections.dataUsage.items.improvement")}</li>
          <li>{t("sections.dataUsage.items.legal")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.dataSharing.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.dataSharing.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.dataSharing.items.mollie")}</li>
          <li>{t("sections.dataSharing.items.email")}</li>
          <li>{t("sections.dataSharing.items.hosting")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.dataRetention.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.dataRetention.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.rights.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.rights.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>{t("sections.rights.items.access")}</li>
          <li>{t("sections.rights.items.rectification")}</li>
          <li>{t("sections.rights.items.erasure")}</li>
          <li>{t("sections.rights.items.portability")}</li>
          <li>{t("sections.rights.items.objection")}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.security.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.security.content")}
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
