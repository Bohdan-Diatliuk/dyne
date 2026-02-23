import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import { Post } from "@/types/post.interface";
import { getTranslations } from "next-intl/server";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations("feed");

  if (!user) {
    redirect('/');
  }

  const { data: follows } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  const followingIds = [user.id, ...(follows?.map(f => f.following_id) ?? [])];

  let posts: Post[] = [];

  if (followingIds.length > 0) {
    const { data } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        users (
          name,
          username,
          avatar_url
        )
      `)
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })
      .limit(50);

    posts = (data as unknown as Post[]) ?? [];
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <p className="flex flex-col items-center mb-6 text-gray-50">
        {t("welcome", { name: user.user_metadata.full_name})}
      </p>

      <div className="flex flex-col items-center gap-4">
        {posts.length === 0 ? (
          <p className="text-main-text mt-10">
            {t("noPosts")}
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              createdAt={post.created_at}
              author={post.users.username}
              authorName={post.users.name}
              avatarUrl={post.users.avatar_url}
            />
          ))
        )}
      </div>
    </div>
  );
}