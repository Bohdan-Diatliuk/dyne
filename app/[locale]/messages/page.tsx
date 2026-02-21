"use client";

import { useMyChats } from "@/hooks/useMeChats"
import ChatCard from "@/components/ChatCard"
import { useTranslations } from "next-intl";

export default function MessagesPage() {
  const { chats, loading } = useMyChats()
  const t = useTranslations("messages");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="flex flex-col items-center mb-5 text-xl font-semibold">
        {t("sms")}
      </h1>
      <div className="flex flex-col items-center gap-2">
        {loading && <p className="text-zinc-400">{t("loading")}</p>}
        {!loading && chats.length === 0 && (
          <p className="text-zinc-400">{t("withoutChat")}</p>
        )}
        {chats.map((chat) => (
          <ChatCard
            key={chat.roomId}
            roomId={chat.roomId}
            otherUser={chat.otherUser}
            lastMessage={chat.lastMessage}
          />
        ))}
      </div>
    </div>
  )
}