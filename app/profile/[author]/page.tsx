import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { UserRound } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import EditProfileBtn from "@/components/EditProfileBtn";
import ProfileStats from "@/components/ProfileStats";

export default async function ProfilePage({
    params
}: {
    params: { author: string }
}) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const { author } = await params;

    if (!currentUser) {
        redirect('/');
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, username, avatar_url, bio, created_at')
        .eq('username', author)
        .single();

    if (error || !user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold">User not found</h1>
            </div>
        );
    }

    const isOwner = currentUser.id === user.id;

    const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

    const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id);   

    const { data: followData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', user.id)
        .single();

    const isFollowing = !!followData;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mb-6">
                <div className="flex items-center gap-6">
                    {user.avatar_url ? (
                        <Image
                            src={user.avatar_url}
                            alt={user.name || 'User'}
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-[120px] h-[120px] rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center">
                            <UserRound size={60} />
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">@{user.username}</p>
                        
                        {user.bio && (
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {user.bio}
                            </p>
                        )}

                        {isOwner ? (
                            <EditProfileBtn user={{ 
                                name: user.name,
                                username: user.username,
                                bio: user.bio,
                                avatar_url: user.avatar_url
                            }} />
                        ) : (
                            <FollowButton 
                                userId={user.id}
                                initialIsFollowing={isFollowing}
                                initialFollowers={followersCount || 0}
                            />
                        )}
                    </div>
                </div>

                <ProfileStats 
                    userId={user.id}
                    initialFollowers={followersCount || 0}
                    initialFollowing={followingCount || 0}
                />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-bold mb-4">Posts</h2>
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    No posts yet
                </div>
            </div>
        </div>
    );
}