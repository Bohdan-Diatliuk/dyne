'use client';

import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("chat");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-btn-unfollow px-6 py-3 text-main-text hover:bg-btn-unfollow-h transition-colors"
    >
      {t("exit")}
    </button>
  );
}