/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePrivateChat(otherUserId: string) {
  const supabase = useRef(createClient()).current;
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);

  useEffect(() => {
    if (!otherUserId) return
    supabase
      .from('users')
      .select('id, username, avatar_url')
      .eq('id', otherUserId)
      .single()
      .then(({ data }) => setOtherUser(data ?? null))
  }, [otherUserId]);

  useEffect(() => {
    if (!otherUserId) return
    supabase
      .rpc('get_or_create_private_room', { other_user_id: otherUserId })
      .then(({ data, error }) => {
        console.log('Room:', data, error)
        setRoomId(data)
      })
  }, [otherUserId]);

  useEffect(() => {
    if (!roomId) return

    const loadMessages = async () => {
      // Без join — тільки чисті поля таблиці
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Messages error:', error)
        setLoading(false)
        return
      }

      const enriched = await Promise.all(
        (data ?? []).map(async (msg: any) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .eq('id', msg.sender_id)
            .single()

          let reply_to = null
          if (msg.reply_to_id) {
            const { data: replyMsg } = await supabase
              .from('private_messages')
              .select('id, content, sender_id')
              .eq('id', msg.reply_to_id)
              .single()

            if (replyMsg) {
              const { data: replySender } = await supabase
                .from('users')
                .select('id, username, avatar_url')
                .eq('id', replyMsg.sender_id)
                .single()
              reply_to = { ...replyMsg, sender: replySender ?? null }
            }
          }

          return { ...msg, sender: senderData ?? null, reply_to }
        })
      )

      setMessages(enriched)
      setLoading(false)
    }

    loadMessages()

    const channel = supabase
      .channel(`private_room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .eq('id', payload.new.sender_id)
            .single()

          let reply_to = null
          if (payload.new.reply_to_id) {
            const { data: replyMsg } = await supabase
              .from('private_messages')
              .select('id, content, sender_id')
              .eq('id', payload.new.reply_to_id)
              .single()

            if (replyMsg) {
              const { data: replySender } = await supabase
                .from('users')
                .select('id, username, avatar_url')
                .eq('id', replyMsg.sender_id)
                .single()
              reply_to = { ...replyMsg, sender: replySender ?? null }
            }
          }

          setMessages((prev) => [
            ...prev,
            { ...payload.new, sender: senderData ?? null, reply_to }
          ])
        }
      )
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [roomId])

  async function sendMessage(content: string, replyToId?: string | null) {
    if (!roomId) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('private_messages').insert({
      room_id: roomId,
      sender_id: user.id,
      content,
      reply_to_id: replyToId ?? null,
    })
    if (error) console.error('Send error:', error.message)
  }

  return { messages, sendMessage, roomId, loading, otherUser }
}