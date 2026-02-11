'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostCardProps } from "@/types/post";
import { Metadata } from "next";


type NewPostProps ={
    addPost: (post: PostCardProps) => void;
}

export default function Page() {
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    
    const handleSubmit = () => {

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
            className="pb-5"
            />
            <textarea 
            rows={5}
            placeholder="What do you want to say?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className=""
            />
            <button 
            onClick={handleSubmit}
            className=""
            >
                Send
            </button>
        </div>
    )
}