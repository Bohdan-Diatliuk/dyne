"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MessageButton({ otherUserId }: { otherUserId: string }) {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = createClient();
    await supabase.rpc('get_or_create_private_room', {
      other_user_id: otherUserId,
    });
    router.push(`/messages/${otherUserId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors"
    >
      <MessageCircle size={16} />
      Написати
    </button>
  );
}