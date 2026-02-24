'use client';

import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

export default function SignInButton() {
  const t = useTranslations("signin");
  const signInWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="rounded-lg bg-btn-click px-6 py-3 text-main-text hover:bg-btn-hover transition-colors"
    >
      {t("signIn")}
    </button>
  );
}
