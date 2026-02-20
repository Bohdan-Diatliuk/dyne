'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  Users,
  UserPenIcon,
  UserSearchIcon,
  UserRound,
  UserRoundCog,
  MessageCircleMore,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserSide } from "@/types/users.interface";
import { useTranslations } from "next-intl";
import SearchPanel from "./SearchPanel";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSide[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const t = useTranslations("sidebar");

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (dbUser) setUsername(dbUser.username);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    { icon: HomeIcon, label: t("home"), href: "/feed" },
    { icon: MessageCircleMore, label: t("chat"), href: "/chat" },
    { icon: Users, label: t("messages"), href: "/messages" },
    { icon: UserPenIcon, label: t("create"), href: "/post/new" },
    { icon: UserSearchIcon, label: t("search"), action: () => setIsSearchOpen(true) },
    { icon: UserRound, label: t("profile"), href: `/profile/${username}` },
    { icon: UserRoundCog, label: t("settings"), href: "/settings" },
  ];

  useEffect(() => {
    if (isSearchOpen && searchQuery === "") loadAllUsers();
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
    if (query.trim().length === 0) { loadAllUsers(); return; }
    if (query.trim().length < 2) return;

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
        className={`h-screen fixed top-0 left-0 z-30 text-foreground transition-all duration-300 ${isSidebarOpen ? "w-36" : "w-20"}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="px-4 py-6 text-xl font-bold uppercase">
          <Link href="/">Dyne</Link>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const baseClasses = `flex items-center p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors duration-200 relative`;

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={baseClasses}>
                  <div className="flex items-center justify-center w-6.5 h-6.5 shrink-0">
                    <Icon size={26} />
                  </div>
                  <span className={`whitespace-nowrap ml-4 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <button key={item.label} onClick={item.action} className={baseClasses}>
                <div className="flex items-center justify-center w-6.5 h-6.5 shrink-0">
                  <Icon size={26} />
                </div>
                <span className={`whitespace-nowrap ml-4 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <SearchPanel
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        onClose={closeSearch}
        onSearch={handleSearch}
      />
    </>
  );
}