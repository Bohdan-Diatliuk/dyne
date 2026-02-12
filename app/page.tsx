'use client';

import MainEffect from "@/components/effects/mainEffect";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
import Loading from "./loading";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Loading />;
  }
  
  return (
    <div className="relative flex justify-center items-center h-screen">
      <MainEffect />
      
      <div className="flex flex-col items-center justify-center gap-8 z-10">
        <p className="text-6xl font-bold">DYNE</p>
        
        {status === 'authenticated' && session?.user ? (
          <>
            <h1 className="text-3xl font-bold">Вітаємо, {session.user.name}!</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/feed')}
                className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700 transition-colors"
              >
                Продовжити
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-lg bg-gray-700 px-6 py-3 text-white hover:bg-gray-900 transition-colors"
              >
                Вийти
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Вітаємо!</h1>
            <button
              onClick={() => signIn('google')}
              className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700 transition-colors"
            >
              Увійти через Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}