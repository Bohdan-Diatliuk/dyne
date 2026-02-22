import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <p className="flex flex-col items-center" >Вітаємо, {user.user_metadata.full_name}!</p>
    </div>
  );
}