"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function MessageButton({ otherUserId }: { otherUserId: string }) {
  const router = useRouter();
  const t = useTranslations("messages");

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
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-btn-click hover:bg-btn-hover text-main-text font-medium transition-colors"
    >
      <MessageCircle size={16} />
      {t("write")}
    </button>
  );
}