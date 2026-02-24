/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import Image from 'next/image';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { messages, loading: messagesLoading, sendMessage } = useRealtimeChat()
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("chat");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (!user) {
        router.push('/')
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    setSending(true)
    const result = await sendMessage(input, replyTo?.id)
    
    if (result?.error) {
      toast.error('Sending error: ' + result.error, {
        duration: 4000,
        action: {
          label: 'OK',
          onClick: () => toast.dismiss()
        }
      })
    } else {
      setInput('')
      setReplyTo(null)
    }
    setSending(false)
  }

  const handleReply = (message: any) => {
    setReplyTo(message)
  }

  const cancelReply = () => {
    setReplyTo(null)
  }

  const handleBack = () => {
    router.push('/feed');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Завантаження...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-main-text font-bold">{t("global")}</h1>
          <p className="text-sm text-secondary-text">
            {t("sign", { name: user.user_metadata.full_name || user.email })}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 items-end text-sm text-main-text bg-btn-click rounded hover:bg-btn-hover transition"
        >
          {t("exit")}
        </button>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-secondary-text">{t("messageLoading")}</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-secondary-text">
              {t("messageZero")}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.user_id === user.id
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <div className="shrink-0">
                      {message.users?.avatar_url ? (
                        <Image
                          src={message.users.avatar_url}
                          alt={message.users.name || 'User'}
                          className="rounded-full object-cover"
                          width={42}
                          height={42}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm">
                          {message.users?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-chat-own text-main-text rounded-br-none'
                          : 'bg-chat-fr text-main-fr rounded-bl-none shadow'
                      }`}
                    >
                      {!isOwn && (
                        <div className="text-xs font-semibold mb-1 opacity-70">
                          {message.users?.name || t("unknown")}
                        </div>
                      )}
                      
                      {message.reply_to && (
                        <div className={`text-xs mb-2 py-2 border-l-2 rounded-lg pl-2 ${
                            isOwn ? 'border-border opacity-70' : 'border-border opacity-60'
                          }`}>
                          <div className="font-semibold">
                            {message.reply_to.users?.name || t("unknown")} :
                          </div>
                          <div className="truncate">
                            {message.reply_to.content}
                          </div>
                        </div>
                      )}
                      
                      <div className="wrap-break-word">{message.content}</div>
                      <div className={`text-xs mt-1 ${isOwn ? 'opacity-70' : 'opacity-50'}`}>
                        {new Date(message.created_at).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleReply(message)}
                      className={`text-xs px-2 py-1 rounded hover:bg-gray-200 hover:text-black transition ${
                        isOwn ? 'self-end' : 'self-start'
                      }`}
                    >
                      {t("answer")}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        {replyTo && (
          <div className="mb-2 p-3 rounded-lg bg-section flex justify-between items-start">
            <div className="flex-1">
              <div className="text-xs font-semibold text-main-text mb-1 pb-2 border-b border-border">
                  {t("answerTo", { name: replyTo.users?.name || t("unknown")})}
              </div>
              <div className="text-md text-main-text truncate">
                {replyTo.content}
              </div>
            </div>
            <button
              onClick={cancelReply}
              className="ml-2 text-main-text hover:text-secondary-text"
            >
              <X />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={replyTo ? t("answerTo", { name: replyTo.users?.name}) : t("enterMessage")}
            disabled={sending}
            className="flex-1 px-4 py-2 text-main-text  border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="px-6 py-2 bg-btn-click text-main-text rounded-lg transition disabled:bg-btn-hover disabled:text-secondary-text disabled:cursor-not-allowed"
          >
            {sending ? t("sending") : t("send")}
          </button>
        </form>
      </div>
    </div>
  )
}