'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostCardProps } from "@/types/post";
import { toast } from "sonner";


export default function Page() {
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    
    const handleSubmit = () => {
        if (!author || !content) {
            toast.warning('Please fill in all form fields', {
                description: 'Both author and content are required to create a post.',
                duration: 4000,
                action: {
                    label: 'OK',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        } else if (author || content) {
            toast.success('Post created successfully!')
        }

        const newPost: PostCardProps = {
            id: Date.now(),
            author,
            content,
            createdAt: new Date().toISOString(),
        };

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.unshift(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));

        router.push('/feed');
    };

    return (
        <div className="flex justify-center flex-col items-center m-50">

            <h1 className="text-2xl font-bold mb-4 p-5">Create a New Post</h1>
            <input 
            type="text" 
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 border border-gray-300 mb-4 rounded-md focus:shadow-xl focus:shadow-gray-600 transition-shadow duration-500"
            />
            <textarea 
            rows={5}
            placeholder="What do you want to say?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-4 py-2 border border-gray-300 mb-4 rounded-md focus:shadow-xl focus:shadow-gray-600 transition-shadow duration-500"
            />
            <button 
            onClick={handleSubmit}
            className="px-4 py-2 w-full max-w-44 bg-gray-500 hover:bg-gray-400 transition-colors duration-300 text-white hover:text-black rounded-md"
            >
                Send
            </button>
        </div>
    )
}