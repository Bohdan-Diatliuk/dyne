'use client'

import Link from "next/link"
import Image from "next/image"
import { X, UserRound } from "lucide-react"
import { useTranslations } from "next-intl"
import { UserSide } from "@/types/users.interface"

interface SearchPanelProps {
  isOpen: boolean
  searchQuery: string
  searchResults: UserSide[]
  isSearching: boolean
  onClose: () => void
  onSearch: (query: string) => void
}

export default function SearchPanel({
  isOpen,
  searchQuery,
  searchResults,
  isSearching,
  onClose,
  onSearch,
}: SearchPanelProps) {
  const t = useTranslations("search")

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-96 border-l-2 border-border bg-background text-foreground shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-main-text  font-semibold">{t("title")}</h2>
            <button onClick={onClose} className="text-main-text hover:text-border">
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            placeholder={t("placeholder")}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2
                     bg-bg-input text-secondary-text
                     focus:outline-none focus:ring-2 focus:ring-gray-500"
            autoFocus
          />

          <div className="mt-4 flex-1 overflow-y-auto">
            {isSearching ? (
              <div className="text-center text-gray-500 mt-8">{t("searching")}</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">{t("notFound")}</div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-section-hover transition-colors"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        className="rounded-full object-cover"
                        width={42}
                        height={42}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center">
                        <UserRound size={20} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-main-text truncate">{user.name}</p>
                      <p className="text-sm text-secondary-text truncate">@{user.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}