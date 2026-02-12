'use client';

import MainEffect from "@/components/effects/mainEffect";
import Sidebar from "@/components/SideBar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    useEffect(() => {
      if (status === 'unauthenticated') {
        window.location.href = '/';
      }
    }, [status]);

    if (status === 'loading') {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Завантаження...</p>
        </div>
      );
    }

    if (status === 'unauthenticated') {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Перенаправлення...</p>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
        <MainEffect words={['lol', 'lmo', 'EPSTEIN']} zIndex={-1} />
      </div>
    );
}