import LanguageSelect from '@/components/LanguageSelect';
import ThemeSwitch from '@/components/ThemeSwitch';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const t = await getTranslations("settings");

    return (
    <div className="max-w-3xl mx-auto my-8 space-y-8">

      <h1 className="text-3xl font-bold">{t("setting")}</h1>

      <section className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">{t("appearance")}</h2>

        <div className="flex items-center justify-between">
          <span>{t("theme")}</span>
          <ThemeSwitch />
        </div>
      </section>

      <section className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">{t("privacy")}</h2>

        <div className="flex items-center justify-between">
          <span>{t("changePassword")}</span>
          <button className="px-4 py-1 bg-zinc-800 rounded-lg">
            {t("update")}
          </button>
        </div>
      </section>

      <section className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">{t("preference")}</h2>

        <div className="flex items-center justify-between">
          <span>{t("language")}</span>
          <LanguageSelect />
        </div>
      </section>

      <section className="bg-zinc-900 p-6 rounded-xl border border-red-500 space-y-4">
        <h2 className="text-lg font-semibold text-red-500">
          {t("danger")}
        </h2>

        <button className="px-4 py-2 bg-red-600 rounded-lg">
          {t("delete")}
        </button>
      </section>

    </div>
  );
}