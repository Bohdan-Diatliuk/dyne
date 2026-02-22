/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function useMyChats() {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChats = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: myRooms } = await supabase
        .from('room_members')
        .select('room_id')

      if (!myRooms?.length) {
        setLoading(false)
        return
      }

      const roomIds = myRooms.map((r: any) => r.room_id)

      const enriched = await Promise.all(
        roomIds.map(async (roomId: string) => {
          const { data: msgs } = await supabase
            .from('private_messages')
            .select('content, created_at, sender:users(username)')
            .eq('room_id', roomId)
            .order('created_at', { ascending: false })
            .limit(1)

          if (!msgs?.length) return null

          const { data: otherMember } = await supabase
            .from('room_members')
            .select('users(id, username, avatar_url)')
            .eq('room_id', roomId)
            .neq('user_id', user.id)
            .single()

          return {
            roomId,
            otherUser: (otherMember?.users as any) ?? null,
            lastMessage: msgs[0],
          }
        })
      )

      const seen = new Set()
      const filtered = enriched.filter((chat) => {
        if (!chat) return false
        if (seen.has(chat.roomId)) return false
        seen.add(chat.roomId)
        return true
      })

      setChats(filtered)
      setLoading(false)
    }

    loadChats()
  }, [])

  return { chats, loading }
}