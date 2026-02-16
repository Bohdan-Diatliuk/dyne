import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function RedirectPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const { data: dbUser } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

    if (!dbUser?.username) {
        redirect('/');
    }

    redirect(`/profile/${dbUser.username}`);
}