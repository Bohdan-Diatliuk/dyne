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
      <h1 className="text-3xl font-bold mb-6">Feed</h1>
      <p>Вітаємо, {user.user_metadata.full_name}!</p>
    </div>
  );
}