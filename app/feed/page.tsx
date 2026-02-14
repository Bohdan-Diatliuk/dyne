'use client';

import  PostCard  from "@/components/PostCard";
import { PostCardProps } from '@/types/post.types';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

export default function FeedPage() {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(savedPosts);
  }, []);

  if (status === 'loading') {
    return null;
  }

  return (
        <div className="flex flex-col w-full max-w-110 mx-auto mt-30">
          {posts.map((post, index) => (
            <PostCard key={`${post.id}-${index}`} id={post.id} createdAt={post.createdAt} author={post.author} content={post.content} />
          ))}
        </div>
  );
}
