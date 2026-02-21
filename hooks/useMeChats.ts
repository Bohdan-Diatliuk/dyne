/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function useMyChats() {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('room_members')
        .select(`
          room_id,
          private_rooms (
            id,
            created_at,
            room_members (
              user_id,
              users (
                id,
                username,
                avatar_url
              )
            ),
            private_messages (
              content,
              created_at,
              sender:users(username)
            )
          )
        `)
        .order('created_at', { referencedTable: 'private_rooms', ascending: false })

      const enriched = (data ?? []).map((item: any) => {
        const room = item.private_rooms
        const otherMember = room?.room_members?.find(
          (m: any) => m.user_id !== user.id
        )
        const messages = room?.private_messages ?? []
        const lastMessage = messages.sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

        return {
          roomId: item.room_id,
          otherUser: otherMember?.users ?? null,
          lastMessage,
        }
      })

      setChats(enriched)
      setLoading(false)
    }

    loadChats()
  }, [])

  return { chats, loading }
}