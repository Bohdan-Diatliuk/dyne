import { PostCardProps } from "@/types/post.interface";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ createdAt, author, authorName, content, avatarUrl }: PostCardProps) {
    const date = new Date(createdAt).toLocaleDateString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="w-full max-w-lg">
            <div className="bg-section w-full min-w-0 rounded-xl p-2 hover:bg-section-hover transition-colors">
                <div className="flex items-center gap-3 px-4 pt-3">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            className="w-9 h-9 rounded-full object-cover"
                            alt={authorName}
                            width={36}
                            height={36}
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
                            {authorName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <Link href={`/profile/${author}`} className="text-main-text font-medium hover:text-zinc-400 transition-colors">
                        @{authorName}
                    </Link>
                </div>
                <p className="px-4 mx-2 mt-2 py-2 border border-zinc-700 rounded-xl text-sm text-secondary-text">
                    {content}
                </p>
                <h4 className="flex flex-col items-end m-2 text-xs text-secondary-text">{date}</h4>
            </div>
        </div>
    );
}