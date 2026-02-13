import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: string
  user_id: string
  content: string
  created_at: string
  users?: {
    name: string | null
    avatar_url: string | null
  } | null
}

export function useRealtimeChat() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Завантаження початкових повідомлень
  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          users (
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error loading messages:', error)
      } else if (data) {
        setMessages(data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Підписка на realtime оновлення
  useEffect(() => {
    const newChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          console.log('New message received:', payload)
          
          // Отримуємо дані користувача для нового повідомлення
          const { data: userData } = await supabase
            .from('users')
            .select('name, avatar_url')
            .eq('id', payload.new.user_id)
            .single()

          const newMessage: Message = {
            ...(payload.new as any),
            users: userData,
          }

          setMessages((current) => [...current, newMessage])
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    setChannel(newChannel)

    return () => {
      console.log('Unsubscribing from channel')
      newChannel.unsubscribe()
    }
  }, [])

  const sendMessage = async (content: string) => {
    if (!session?.user?.email) {
      console.error('No user session')
      return { error: 'Not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: session.user.email,
          content: content.trim(),
        })

      if (error) {
        console.error('Error sending message:', error)
        return { error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error sending message:', error)
      return { error: 'Failed to send message' }
    }
  }

  return { messages, loading, sendMessage, refetch: loadMessages }
}