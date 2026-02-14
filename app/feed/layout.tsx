'use client';

import MainEffect from "@/components/effects/mainEffect";
import Sidebar from "@/components/SideBar";
import { useSession } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    if (status === 'loading') {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Завантаження...</p>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
        <MainEffect words={['lol', 'lmo', 'EPSTEIN']} zIndex={-1} />
      </div>
    );
}