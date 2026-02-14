import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
    const session = await getServerSession();

    if (!session!.user?.id) {
        redirect('/');
    }

    redirect(`/profile/${session?.user.id}`);
}