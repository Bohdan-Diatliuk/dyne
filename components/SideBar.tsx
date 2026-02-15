'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  Users,
  UserPenIcon,
  UserSearchIcon,
  UserRound,
  UserRoundCog,
  MessageCircleMore,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UserSide } from "@/types/users.interface";


export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSide[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { data: session } = useSession();

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    { icon: MessageCircleMore, label: "Chat", href: "/chat" },
    { icon: Users, label: "Messages", href: "/messages" },
    { icon: UserPenIcon, label: "Create", href: "/post/new" },
    { icon: UserSearchIcon, label: "Search", action: () => setIsSearchOpen(true) },
    { icon: UserRound, label: "Profile", href: `/profile/${session?.user?.username}` },
    { icon: UserRoundCog, label: "Settings", href: "/settings" },
  ];

  useEffect(() => {
    if (isSearchOpen && searchQuery === "") {
      loadAllUsers();
    }
  }, [isSearchOpen]);

  const loadAllUsers = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/users/search?q=');
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      loadAllUsers();
      return;
    }

    if (query.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      <div
        className={`
          h-screen fixed top-0 left-0 z-30
          text-foreground
          transition-all duration-300
          overflow-hidden
          hidden lg:block
          ${isSidebarOpen ? "w-36" : "w-20"}
        `}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="px-4 py-6 text-xl font-bold uppercase">
          <Link href="/">Dyne</Link>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const baseClasses = `
              flex items-center p-3 rounded-2xl
              hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors duration-200
              relative
            `;

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={baseClasses}>
                  <div className="flex items-center justify-center w-6.5 h-6.5 shrink-0">
                    <Icon size={26} />
                  </div>
                  <span 
                    className={`
                      whitespace-nowrap ml-4
                      transition-opacity duration-300
                      ${isSidebarOpen ? "opacity-100" : "opacity-0"}
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                onClick={item.action}
                className={baseClasses}
              >
                <div className="flex items-center justify-center w-6.5 h-6.5 shrink-0">
                  <Icon size={26} />
                </div>
                <span 
                  className={`
                    whitespace-nowrap ml-4
                    transition-opacity duration-300
                    ${isSidebarOpen ? "opacity-100" : "opacity-0"}
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeSearch}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-96 border-l-2 border-gray-600 bg-black/50 text-foreground shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isSearchOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Search
            </h2>
            <button
              onClick={closeSearch}
              className="text-white hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 
                     bg-white dark:bg-zinc-800 text-foreground
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <div className="mt-4 flex-1 overflow-y-auto">
            {isSearching ? (
              <div className="text-center text-gray-500 mt-8">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                No users found
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
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
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}