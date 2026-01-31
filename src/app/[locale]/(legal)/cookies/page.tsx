import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "legal.cookies" });
  return {
    title: t("title"),
  };
}

export default function CookiesPage() {
  const t = useTranslations("legal.cookies");

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
          {t("sections.whatAreCookies.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.whatAreCookies.content")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.typesOfCookies.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-6">
          {t("sections.typesOfCookies.content")}
        </p>

        <div className="space-y-6">
          <div className="bg-stone-50 rounded-lg p-6">
            <h3 className="font-semibold text-stone-800 mb-2">
              {t("sections.typesOfCookies.essential.title")}
            </h3>
            <p className="text-stone-600 text-sm mb-3">
              {t("sections.typesOfCookies.essential.description")}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 text-stone-700">Cookie</th>
                    <th className="text-left py-2 text-stone-700">{t("sections.typesOfCookies.tableHeaders.purpose")}</th>
                    <th className="text-left py-2 text-stone-700">{t("sections.typesOfCookies.tableHeaders.duration")}</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-b border-stone-100">
                    <td className="py-2 font-mono text-xs">session_token</td>
                    <td className="py-2">{t("sections.typesOfCookies.essential.cookies.session")}</td>
                    <td className="py-2">{t("sections.typesOfCookies.durations.session")}</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 font-mono text-xs">locale</td>
                    <td className="py-2">{t("sections.typesOfCookies.essential.cookies.locale")}</td>
                    <td className="py-2">1 {t("sections.typesOfCookies.durations.year")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">cookie_consent</td>
                    <td className="py-2">{t("sections.typesOfCookies.essential.cookies.consent")}</td>
                    <td className="py-2">1 {t("sections.typesOfCookies.durations.year")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg p-6">
            <h3 className="font-semibold text-stone-800 mb-2">
              {t("sections.typesOfCookies.functional.title")}
            </h3>
            <p className="text-stone-600 text-sm mb-3">
              {t("sections.typesOfCookies.functional.description")}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 text-stone-700">Cookie</th>
                    <th className="text-left py-2 text-stone-700">{t("sections.typesOfCookies.tableHeaders.purpose")}</th>
                    <th className="text-left py-2 text-stone-700">{t("sections.typesOfCookies.tableHeaders.duration")}</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-b border-stone-100">
                    <td className="py-2 font-mono text-xs">builder_draft</td>
                    <td className="py-2">{t("sections.typesOfCookies.functional.cookies.draft")}</td>
                    <td className="py-2">30 {t("sections.typesOfCookies.durations.days")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">preferences</td>
                    <td className="py-2">{t("sections.typesOfCookies.functional.cookies.preferences")}</td>
                    <td className="py-2">1 {t("sections.typesOfCookies.durations.year")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg p-6">
            <h3 className="font-semibold text-stone-800 mb-2">
              {t("sections.typesOfCookies.analytics.title")}
            </h3>
            <p className="text-stone-600 text-sm mb-3">
              {t("sections.typesOfCookies.analytics.description")}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 text-stone-700">Cookie</th>
                    <th className="text-left py-2 text-stone-700">{t("sections.typesOfCookies.tableHeaders.purpose")}</th>
                    <th className="text-left py-2 text-stone-700">{t("sections.typesOfCookies.tableHeaders.duration")}</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr>
                    <td className="py-2 font-mono text-xs">_plausible</td>
                    <td className="py-2">{t("sections.typesOfCookies.analytics.cookies.plausible")}</td>
                    <td className="py-2">{t("sections.typesOfCookies.durations.session")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.thirdParty.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.thirdParty.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>
            <strong>Stripe</strong> - {t("sections.thirdParty.services.stripe")}
          </li>
          <li>
            <strong>Railway</strong> - {t("sections.thirdParty.services.railway")}
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.management.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed mb-4">
          {t("sections.management.content")}
        </p>
        <ul className="list-disc pl-6 text-stone-600 space-y-2">
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-burgundy-700 hover:underline">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-burgundy-700 hover:underline">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-burgundy-700 hover:underline">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-burgundy-700 hover:underline">
              Microsoft Edge
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-4">
          {t("sections.updates.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed">
          {t("sections.updates.content")}
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
          <a href="mailto:info@javooraltijd.nl" className="text-burgundy-700 hover:underline">
            info@javooraltijd.nl
          </a>
        </p>
      </section>
    </article>
  );
}
