'use client';

import  PostCard  from "@/components/PostCard";
import { PostCardProps } from '@/types/post';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(savedPosts);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  if (!session) return null;

  return (
        <div className="flex flex-col w-full max-w-110 mx-auto mt-30">
          {posts.map((post, index) => (
            <PostCard key={`${post.id}-${index}`} id={post.id} createdAt={post.createdAt} author={post.author} content={post.content} />
          ))}
        </div>
  );
}
