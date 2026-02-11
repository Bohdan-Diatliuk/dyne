import { PostCardProps } from "@/types/post";

export default function PostCard({ createdAt, author, content }: PostCardProps) {
    const date = new Date(createdAt).toLocaleDateString('uk-UA');

    return (
        <div className="w-auto h-auto p-4 m-4 bg-amber-50 border rounded-3xl order-1">
            <h3 className="text-red-700 uppercase font-bold pb-2">{author}</h3>
            <p className='bg-black text-white p-3 rounded-3xl'>{content}</p>
            <p className='bg-black text-white p-3 rounded-3xl'>{date}</p>
        </div>
    );
}
