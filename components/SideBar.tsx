'use client';

import Link from "next/link";
import { useState } from "react";
import { HomeIcon, Users, UserPenIcon, UserSearchIcon, UserRound, UserRoundCog } from 'lucide-react'

const menuItems = [
    { icon: HomeIcon, label: 'Home', href: '/feed' },
    { icon: Users, label: 'Messages', href: '/messages' },
    { icon: UserPenIcon, label: 'Create', href: '/post/new' },
    { icon: UserSearchIcon, label: 'Search', href: '/search' },
    { icon: UserRound, label: 'Profile', href: '/profile' },
    { icon: UserRoundCog, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className="h-screen py-5 px-4 mx-0 sticky top-0" 
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            >
            <div className="text-xl font-bold  uppercase p-3 my-2 rounded-2xl hover:hover:bg-gray-900 transition-colors duration-300">
                <Link href="/" className="h-0 w-0">
                    Dyne
                </Link>
            </div>
            <nav className="flex flex-col gap-4 mt-10">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link href={item.href} key={item.label} className="flex items-center gap-4 p-2 rounded-2xl">
                            <Icon size={28} />
                            <span
                                className={`absolute left-16 whitespace-nowrap px-2 py-1 rounded transition-all duration-300 
                                ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
        </>
    );
}