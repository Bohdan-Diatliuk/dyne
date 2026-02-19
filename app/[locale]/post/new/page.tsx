'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostCardProps } from "@/types/post.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function PostNewPage() {
    const [username, setUsername] = useState<string | null>(null);
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    const t = useTranslations("create");

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (profile?.username) {
                    setUsername(profile.username);
                }
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = () => {
        const finalAuthor = username ?? author;

        if (!finalAuthor || !content) {
            toast.warning('Please fill in all form fields', {
                description: 'Both author and content are required to create a post.',
                duration: 4000,
                action: {
                    label: 'OK',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        toast.success('Post created successfully!');

        const newPost: PostCardProps = {
            id: Date.now(),
            author: finalAuthor,
            content,
            createdAt: new Date().toISOString(),
        };

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.unshift(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));

        router.push('/feed');
    };

    return (
        <div className="flex flex-col items-center mt-30">
            <h1 className="text-5xl font-bold mb-4 p-5">{t("header")}</h1>

            {username ? (
                <p className="w-full max-w-86 px-4 py-2 border border-gray-200 bg-gray-100 mb-4 rounded-md text-gray-500">
                    {username}
                </p>
            ) : (
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full max-w-86 px-4 py-2 border border-gray-300 mb-4 rounded-md focus:shadow-xl focus:shadow-gray-600 transition-shadow duration-500"
                />
            )}

            <textarea
                rows={5}
                placeholder={t("post")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full max-w-86 px-4 py-2 border border-gray-300 mb-4 rounded-md focus:shadow-xl focus:shadow-gray-600 transition-shadow duration-500"
            />
            <button
                onClick={handleSubmit}
                className="px-4 py-2 w-full max-w-86 h-12 bg-gray-500 hover:bg-gray-400 transition-colors duration-300 text-xl text-white hover:text-black rounded-md"
            >
                {t("send")}
            </button>
        </div>
    );
}