import MainEffect from "@/components/effects/mainEffect"
import Sidebar from "@/components/SideBar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Messages'
}

export default function MessagesLayout ({ children }: { children: React.ReactNode }) {
    return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
            {children}
        </main>
        <MainEffect words={['badabum']} />
    </div>
    ) 
}