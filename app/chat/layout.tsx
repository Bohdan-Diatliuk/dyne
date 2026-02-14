import MainEffect from "@/components/effects/mainEffect";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Chat'
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <div>
                {children}
            </div>
            <MainEffect words={['chat', 'odaaa', 'poplavsky']} zIndex={-1} />
        </main>
    )
}