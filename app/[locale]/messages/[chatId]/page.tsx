"use client";

import { use } from "react";
import { usePrivateChat } from "@/hooks/usePrivateChat"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl";

export default function MessPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const { messages, sendMessage, loading } = usePrivateChat(chatId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("messages");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null)
    })
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    await sendMessage(input.trim())
    setInput('')
    setSending(false)
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-4">
        {loading && <p className="text-zinc-400 text-center">{t("loading")}</p>}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                isMe
                  ? 'bg-zinc-600 text-white rounded-br-sm'
                  : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-2 border-t border-zinc-800">
        <input
          className="flex-1 bg-zinc-900 rounded-xl px-4 py-2 text-sm outline-none"
          placeholder={t("writeSms")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm transition-colors"
        >
          {sending ? '...' : t("send")}
        </button>
      </div>
    </div>
  )
}