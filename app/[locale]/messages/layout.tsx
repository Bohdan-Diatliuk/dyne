import MainEffect from "@/components/effects/mainEffect"
import Sidebar from "@/components/SideBar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Messages'
}

export default function MessagesLayout ({ children }: { children: React.ReactNode }) {
    return (
    <main>
        <Sidebar />
        <div>
            {children}
        </div>
        <MainEffect words={['badabum']} />
    </main>
    ) 
}