import Link from "next/link"

interface ChatCardProps {
  roomId: string
  otherUser: { id: string; username: string; avatar_url?: string } | null
  lastMessage?: { content: string; created_at: string; sender?: { username: string } }
}

export default function ChatCard({ roomId, otherUser, lastMessage }: ChatCardProps) {
  const time = lastMessage
    ? new Date(lastMessage.created_at).toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <Link href={`/messages/${otherUser?.id}`} className="w-full max-w-lg">
      <div className="bg-zinc-900 w-full h-auto rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
        <div className="flex items-center gap-3 px-4 pt-3">
          {otherUser?.avatar_url ? (
            <img
              src={otherUser.avatar_url}
              className="w-9 h-9 rounded-full object-cover"
              alt={otherUser.username}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
              {otherUser?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <h1 className="font-medium">@{otherUser?.username ?? 'Невідомий'}</h1>
        </div>
        <p className="px-4 mx-2 mt-2 py-2 border border-zinc-700 rounded-xl text-sm text-zinc-300 truncate">
          {lastMessage?.content ?? 'Немає повідомлень'}
        </p>
        <h2 className="flex flex-col items-end m-2 text-xs text-zinc-500">{time}</h2>
      </div>
    </Link>
  )
}