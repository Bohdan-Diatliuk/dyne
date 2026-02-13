'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'

export default function Chat() {
  const { data: session, status } = useSession()
  const { messages, loading, sendMessage } = useRealtimeChat()
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

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
    const result = await sendMessage(input)
    
    if (result?.error) {
      alert('Помилка відправки: ' + result.error)
    } else {
      setInput('')
    }
    setSending(false)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Завантаження...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl text-black font-bold">Realtime Chat</h1>
        <p className="text-gray-600">Увійдіть, щоб почати спілкування</p>
        <button
          onClick={() => signIn('google')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Увійти через Google
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Realtime Chat</h1>
          <p className="text-sm text-gray-600">
            Увійшли як {session.user.name}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Вийти
        </button>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
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
            const isOwn = message.user_id === session.user.email
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <div className="shrink-0">
                      {message.users?.avatar_url ? (
                        <img
                          src={message.users.avatar_url}
                          alt={message.users.name || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                          {message.users?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none shadow'
                    }`}
                  >
                    {!isOwn && (
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {message.users?.name || 'Невідомий'}
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
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введіть повідомлення..."
            disabled={sending}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {sending ? 'Відправка...' : 'Відправити'}
          </button>
        </form>
      </div>
    </div>
  )
}