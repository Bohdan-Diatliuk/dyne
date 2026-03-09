import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { UserRound } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import EditProfileBtn from "@/components/EditProfileBtn";
import ProfileStats from "@/components/ProfileStats";
import { getTranslations } from "next-intl/server";
import MessageButton from "@/components/MessageButton";
import PostCard from "@/components/PostCard"; // ← твій компонент для відображення поста

export default async function ProfilePage({
    params
}: {
    params: { author: string }
}) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const { author } = await params;
    const t = await getTranslations("profile");

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

    // Завантажуємо пости користувача
    // Адаптуй назву таблиці та полів під свою схему БД
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Блок профілю */}
            <div className="bg-section rounded-lg shadow-lg p-8 mb-6">
                <div className="flex items-center gap-6">
                    {user.avatar_url ? (
                        <Image
                            src={user.avatar_url}
                            alt={user.name || 'User'}
                            width={100}
                            height={100}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-30 h-30 rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center">
                            <UserRound size={60} />
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl text-main-text font-bold mb-2">{user.name}</h1>
                        <p className="text-secondary-text mb-2">@{user.username}</p>

                        {user.bio && (
                            <p className="text-secondary-text mb-4">
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
                            <div className="flex flex-col md:flex-row">
                                <FollowButton
                                    userId={user.id}
                                    initialIsFollowing={isFollowing}
                                    initialFollowers={followersCount || 0}
                                />
                                <MessageButton otherUserId={user.id} />
                            </div>
                        )}
                    </div>
                </div>

                <ProfileStats
                    userId={user.id}
                    initialFollowers={followersCount || 0}
                    initialFollowing={followingCount || 0}
                />
            </div>

            <div className="bg-section rounded-lg shadow-lg p-8">
                <h2 className="text-xl text-main-text font-bold mb-4">
                    {t("post")}
                    {posts && posts.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-secondary-text">
                            ({posts.length})
                        </span>
                    )}
                </h2>

                {!posts || posts.length === 0 ? (
                    <div className="text-center text-secondary-text py-12">
                        {t("postCount")}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                createdAt={post.created_at}
                                content={post.content}
                                author={user.username}
                                authorName={user.name}
                                avatarUrl={user.avatar_url} 
                                id={post.id}
                                />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}