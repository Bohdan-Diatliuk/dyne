/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel, User } from '@supabase/supabase-js'
import { Message, ReplyToMessage } from '@/types/chat.interface'

export function useRealtimeChat() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const { data: messagesData, error: messagesError } = await supabase
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

      if (messagesError) {
        console.error('Error loading messages:', messagesError)
        setLoading(false)
        return
      }

      if (!messagesData) {
        setMessages([])
        setLoading(false)
        return
      }

      console.log('Messages loaded:', messagesData)

      const messagesWithReplies = await Promise.all(
        messagesData.map(async (msg: any) => {
          let replyTo = null

          if (msg.reply_to_id) {
            console.log('Loading reply for message:', msg.id, 'reply_to_id:', msg.reply_to_id)
            
            const { data: replyData, error: replyError } = await supabase
              .from('messages')
              .select(`
                id,
                content,
                users (
                  name,
                  avatar_url
                )
              `)
              .eq('id', msg.reply_to_id)
              .maybeSingle()

            if (replyError) {
              console.error('Error loading reply:', replyError)
            } else if (replyData) {
              console.log('Reply data loaded:', replyData)
              replyTo = {
                id: replyData.id,
                content: replyData.content,
                users: Array.isArray(replyData.users) ? replyData.users[0] : replyData.users
              }
            }
          }

          return {
            ...msg,
            users: Array.isArray(msg.users) ? msg.users[0] : msg.users,
            reply_to: replyTo
          }
        })
      )

      console.log('Final messages with replies:', messagesWithReplies)
      setMessages(messagesWithReplies)
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
            console.log('Fetching reply_to message for:', payload.new.reply_to_id)
            
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
              .maybeSingle()
            
            console.log('Reply message data:', replyMessage)
            
            if (replyMessage) {
              replyToData = {
                id: replyMessage.id,
                content: replyMessage.content,
                users: Array.isArray(replyMessage.users) ? replyMessage.users[0] : replyMessage.users
              }
              console.log('Normalized reply data:', replyToData)
            }
          }

          const newMessage: Message = {
            ...(payload.new as Message),
            users: userData,
            reply_to: replyToData,
          }

          console.log('Final new message:', newMessage)
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
    if (!user?.id) {
      console.error('No user session')
      return { error: 'Not authenticated' }
    }

    console.log('Sending message with reply_to_id:', replyToId)

    try {
      const { error, data } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content: content.trim(),
          reply_to_id: replyToId || null,
        })
        .select()

      console.log('Insert result:', { data, error })

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