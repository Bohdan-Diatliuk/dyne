/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import Image from 'next/image';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { data: session, status } = useSession()
  const { messages, loading, sendMessage } = useRealtimeChat()
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetch('/api/sync-user', { method: 'POST' })
        .then(res => res.json())
        .then(data => console.log('User synced:', data))
        .catch(err => console.error('Error syncing user:', err))
    }
  }, [session])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    setSending(true)
    const result = await sendMessage(input, replyTo?.id)
    
    if (result?.error) {
      toast.error('Помилка відправки: ' + result.error, {
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

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Global Chat</h1>
          <p className="text-sm text-gray-400">
            Увійшли як {session?.user.name}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 items-end text-sm text-black hover:text-white bg-gray-300 rounded hover:bg-gray-600 transition"
        >
          Вийти
        </button>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Завантаження повідомлень...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">
              Поки що немає повідомлень. Будьте першим!
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.user_id === session?.user.email
            
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
                          ? 'bg-gray-800 text-white rounded-br-none'
                          : 'bg-gray-300 text-gray-900 rounded-bl-none shadow'
                      }`}
                    >
                      {!isOwn && (
                        <div className="text-xs font-semibold mb-1 opacity-70">
                          {message.users?.name || 'Невідомий'}
                        </div>
                      )}
                      
                      {message.reply_to && (
                        <div className={`text-xs mb-2 pb-2 border-l-2 pl-2 ${
                          isOwn ? 'border-gray-600 opacity-70' : 'border-gray-400 opacity-60'
                        }`}>
                          <div className="font-semibold">
                            {message.reply_to.users?.name || 'Невідомий'}
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
                        })}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleReply(message)}
                      className={`text-xs px-2 py-1 rounded hover:bg-gray-200 hover:text-black transition ${
                        isOwn ? 'self-end' : 'self-start'
                      }`}
                    >
                      Відповісти
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
          <div className="mb-2 p-3 bg-gray-100 rounded-lg flex justify-between items-start">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Відповідь на {replyTo.users?.name || 'Невідомий'}
              </div>
              <div className="text-sm text-gray-700 truncate">
                {replyTo.content}
              </div>
            </div>
            <button
              onClick={cancelReply}
              className="ml-2 text-gray-500 hover:text-gray-700"
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
            placeholder={replyTo ? `Відповісти ${replyTo.users?.name}...` : "Введіть повідомлення..."}
            disabled={sending}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg transition disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed"
          >
            {sending ? 'Відправка...' : 'Відправити'}
          </button>
        </form>
      </div>
    </div>
  )
}