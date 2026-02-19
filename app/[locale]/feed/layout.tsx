import MainEffect from "@/components/effects/mainEffect";
import Sidebar from "@/components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen">
            <MainEffect />
            <Sidebar />
            <main className="flex-1 lg:ml-20">
                {children}
            </main>
        </div>
    );
}