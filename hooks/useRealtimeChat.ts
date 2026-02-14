/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { Message, ReplyToMessage } from '@/types/chat.interface'


export function useRealtimeChat() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

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
          ),
          reply_to:messages!reply_to_id (
            id,
            content,
            users (
              name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error loading messages:', error)
      } else if (data) {
        const normalizedMessages = data.map((msg: any) => ({
          ...msg,
          users: Array.isArray(msg.users) ? msg.users[0] : msg.users,
          reply_to: msg.reply_to ? {
            ...msg.reply_to,
            users: Array.isArray(msg.reply_to.users) ? msg.reply_to.users[0] : msg.reply_to.users
          } : null
        }))
        setMessages(normalizedMessages)
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
          
          const { data: userData } = await supabase
            .from('users')
            .select('name, avatar_url')
            .eq('id', payload.new.user_id)
            .single()

          let replyToData: ReplyToMessage | null = null
          if (payload.new.reply_to_id) {
            const { data: replyMessage } = await supabase
              .from('messages')
              .select(`
                id,
                content,
                users (
                  name,
                  avatar_url
                )
              `)
              .eq('id', payload.new.reply_to_id)
              .single()
            
            if (replyMessage) {
              replyToData = {
                id: replyMessage.id,
                content: replyMessage.content,
                users: Array.isArray(replyMessage.users) ? replyMessage.users[0] : replyMessage.users
              }
            }
          }

          const newMessage: Message = {
            ...(payload.new as Message),
            users: userData,
            reply_to: replyToData,
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

  const sendMessage = async (content: string, replyToId?: string) => {
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
          reply_to_id: replyToId || null,
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