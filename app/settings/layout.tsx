import Sidebar from "@/components/SideBar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}