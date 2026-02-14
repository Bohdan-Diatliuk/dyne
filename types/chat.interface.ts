export interface User {
  name: string | null
  avatar_url: string | null
}

export interface ReplyToMessage {
  id: string
  content: string
  users: User | null
}

export interface Message {
  id: string
  user_id: string
  content: string
  created_at: string
  reply_to_id?: string | null
  users?: User | null
  reply_to?: ReplyToMessage | null
}
