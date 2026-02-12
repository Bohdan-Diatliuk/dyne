'use client';

import { useParams } from "next/navigation";

export default function ProfilePage() {
    const params = useParams();
    return (
        <div>
            <h1>Profile: {params.author}</h1>
        </div>
    );
}