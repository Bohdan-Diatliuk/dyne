import { PostCardProps } from "@/types/post";
import Link from "next/link";

export default function PostCard({ createdAt, author, content }: PostCardProps) {
    const date = new Date(createdAt).toLocaleDateString('uk-UA');

    return (
        <div className="flex flex-col w-full max-w-xl p-4">
            <span className="text-2xl text-gray-50 px-5 mb-2">
                <Link href={`/profile/${author}`} className="hover:text-gray-400">
                    {author}
                </Link>
            </span>
            <p className="text-gray-50 m-2 p-4 border border-gray-400 rounded-2xl">{content}</p>
            <h4 className="text-sm text-gray-400 self-end px-5">{date}</h4>
        </div>
    );
}
