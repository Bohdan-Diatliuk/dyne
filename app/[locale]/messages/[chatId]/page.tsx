/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { use } from "react";
import { usePrivateChat } from "@/hooks/usePrivateChat"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

export default function MessPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const { messages, sendMessage, loading, otherUser } = usePrivateChat(chatId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("messages");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    await sendMessage(input.trim(), replyTo?.id ?? null);
    setInput('');
    setReplyTo(null);
    setSending(false);
  };

  const handleReply = (message: any) => setReplyTo(message);
  const cancelReply = () => setReplyTo(null);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {otherUser ? (
            <>
              {otherUser.avatar_url ? (
                <Image
                  src={otherUser.avatar_url}
                  alt={otherUser.username || '?'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                  {otherUser.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <h1 className="text-xl font-bold">{otherUser.username}</h1>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          )}
        </div>
        <button
          onClick={() => router.push('/feed')}
          className="px-4 py-2 text-sm text-black hover:text-white bg-gray-300 rounded hover:bg-gray-600 transition"
        >
          {t("exit")}
        </button>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">{t("loading")}</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">{t("messageZero")}</div>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <div className="shrink-0">
                      {msg.sender?.avatar_url ? (
                        <Image
                          src={msg.sender.avatar_url}
                          alt={msg.sender?.username || 'User'}
                          className="rounded-full object-cover"
                          width={42}
                          height={42}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center text-sm">
                          {msg.sender?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div className={`px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-gray-800 text-white rounded-br-none'
                        : 'bg-gray-300 text-gray-900 rounded-bl-none shadow'
                    }`}>
                      {!isOwn && (
                        <div className="text-xs font-semibold mb-1 opacity-70">
                          {msg.sender?.username || t("unknown")}
                        </div>
                      )}

                      {msg.reply_to && (
                        <div className={`text-xs mb-2 py-2 border-l-2 rounded-lg pl-2 ${
                          isOwn ? 'border-gray-600 opacity-70' : 'border-gray-400 opacity-60'
                        }`}>
                          <div className="font-semibold">
                            {msg.reply_to.sender?.username || t("unknown")} :
                          </div>
                          <div className="truncate">{msg.reply_to.content}</div>
                        </div>
                      )}

                      <div className="wrap-break-word">{msg.content}</div>
                      <div className={`text-xs mt-1 ${isOwn ? 'opacity-70' : 'opacity-50'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: '2-digit',
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReply(msg)}
                      className={`text-xs px-2 py-1 rounded hover:bg-gray-200 hover:text-black transition ${
                        isOwn ? 'self-end' : 'self-start'
                      }`}
                    >
                      {t("answer")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        {replyTo && (
          <div className="mb-2 p-3 bg-gray-800 rounded-lg flex justify-between items-start">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-300 mb-1 pb-2 border-b border-gray-500">
                {t("answerTo", { name: replyTo.sender?.username || t("unknown") })}
              </div>
              <div className="text-md text-white truncate">
                {replyTo.content}
              </div>
            </div>
            <button onClick={cancelReply} className="ml-2 text-white hover:text-gray-700">
              <X />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={replyTo ? t("answerTo", { name: replyTo.sender?.username }) : t("writeSms")}
            disabled={sending}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg transition disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed"
          >
            {sending ? t("sending") : t("send")}
          </button>
        </form>
      </div>
    </div>
  );
}