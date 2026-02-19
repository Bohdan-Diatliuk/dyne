import LanguageSelect from '@/components/LanguageSelect';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function SettingsPage() {
    return (
    <div className="max-w-3xl mx-auto my-8 space-y-8">

      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Appearance</h2>

        <div className="flex items-center justify-between">
          <span>Theme</span>
          <ThemeSwitch />
        </div>
      </section>

      <section className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Privacy & Security</h2>

        <div className="flex items-center justify-between">
          <span>Change password</span>
          <button className="px-4 py-1 bg-zinc-800 rounded-lg">
            Update
          </button>
        </div>
      </section>

      <section className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">App Preferences</h2>

        <div className="flex items-center justify-between">
          <span>Languages:</span>
          <LanguageSelect />
        </div>
      </section>

      <section className="bg-zinc-900 p-6 rounded-xl border border-red-500 space-y-4">
        <h2 className="text-lg font-semibold text-red-500">
          Danger Zone
        </h2>

        <button className="px-4 py-2 bg-red-600 rounded-lg">
          Delete account
        </button>
      </section>

    </div>
  );
}