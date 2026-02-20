import MainEffect from "@/components/effects/mainEffect";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations("home");

  if (user) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!dbUser) {
      const username = user.user_metadata.full_name
        ? user.user_metadata.full_name.toLowerCase().replace(/\s+/g, '-')
        : user.email!.split('@')[0];

      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name || user.email?.split('@')[0],
        username: username,
        avatar_url: user.user_metadata.avatar_url,
      });
    }
  }

  return (
    <div className="relative flex justify-center items-center h-screen">
      <MainEffect />
      
      <div className="flex flex-col items-center justify-center gap-8 z-10">
        <p className="text-6xl font-bold">DYNE</p>
        
        {user ? (
          <>
            <h1 className="text-3xl font-bold">{t("welcome", { name: user.user_metadata.full_name})}</h1>
            <div className="flex gap-4">
              <form action="/feed">
                <button className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700 transition-colors">
                  {t("continue")}
                </button>
              </form>
              <SignOutButton />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{t("welcomeGuest")}</h1>
            <SignInButton />
          </>
        )}
      </div>
    </div>
  );
}