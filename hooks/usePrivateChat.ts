"use client";

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'  // ← важливо: саме так як в глобальному

export function usePrivateChat(otherUserId: string) {
  const supabase = createClient()  // ← створюємо всередині як в useRealtimeChat
  const [roomId, setRoomId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!otherUserId) return

    supabase
      .rpc('get_or_create_private_room', { other_user_id: otherUserId })
      .then(({ data, error }) => {
        console.log('Room:', data, error)  // ← додай щоб побачити чи room створюється
        setRoomId(data)
      })
  }, [otherUserId])

  useEffect(() => {
    if (!roomId) return

    supabase
      .from('private_messages')
      .select(`*, sender:users(id, username, avatar_url)`)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        console.log('Messages:', data, error)  // ← перевір чи є помилка
        setMessages(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`private_room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'private_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .eq('id', payload.new.sender_id)
            .single()

          setMessages((prev) => [...prev, { ...payload.new, sender: senderData }])
        }
      )
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [roomId])

  async function sendMessage(content: string) {
    if (!roomId) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No user!')
      return
    }

    const { error } = await supabase.from('private_messages').insert({
      room_id: roomId,
      sender_id: user.id,
      content,
    })

    if (error) console.error('Send error:', error)  // ← побачиш конкретну помилку
  }

  return { messages, sendMessage, roomId, loading }
}