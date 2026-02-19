import MainEffect from "@/components/effects/mainEffect"
import Sidebar from "@/components/SideBar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Profile'
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
                {children}
            </main>
            <MainEffect words={['ooo']} />
        </div>
    )
}