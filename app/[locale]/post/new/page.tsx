'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function PostNewPage() {
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const t = useTranslations("create");

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);

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

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.warning('Please fill in all form fields', {
                description: 'Content is required to create a post.',
                duration: 4000,
                action: {
                    label: 'OK',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (!userId) {
            toast.error('You must be logged in to create a post.');
            return;
        }

        setIsSubmitting(true);

        const supabase = createClient();
        const { error } = await supabase
            .from('posts')
            .insert({ user_id: userId, content: content.trim() });

        setIsSubmitting(false);

        if (error) {
            toast.error('Failed to create post. Please try again.');
            console.error(error);
            return;
        }

        toast.success('Post created successfully!');
        router.push('/feed');
    };

    return (
        <div className="flex flex-col items-center mt-30">
            <h1 className="text-5xl text-main-text font-bold mb-4 p-5">{t("header")}</h1>

            {username && (
                <p className="w-full max-w-86 px-4 py-2 border border-border bg-section mb-4 rounded-md text-secondary-text">
                    {username}
                </p>
            )}

            <textarea
                rows={5}
                placeholder={t("post")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full max-w-86 px-4 py-2 border text-main-text border-border mb-4 rounded-md focus:shadow-xl focus:shadow-gray-600 transition-shadow duration-500"
            />
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 w-full max-w-86 h-12 bg-btn-click hover:bg-btn-hover transition-colors duration-300 text-xl text-main-text rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? '...' : t("send")}
            </button>
        </div>
    );
}