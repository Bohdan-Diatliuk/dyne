import { authConfig } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage({
    params
}: {
    params: { author: string }
}) {
    const session = await getServerSession(authConfig);
    const { author } = await params;

    const isOwner = session?.user?.username === author || session?.user?.email === author;


    if (!session) {
        redirect('/')
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex">
                <span>Привіт, {session.user.name}!</span>
                <span className="self-end">{session.user.email}</span>
            </div>
            <div>
                <p>aa</p>
            </div>
            {isOwner && (
                <div>
                    <h1>Привєт овнер</h1>
                </div>
            )}
        </div>
    );
}