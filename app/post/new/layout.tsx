import MainEffect from "@/components/effects/mainEffect";
import Sidebar from "@/components/SideBar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Post",
    description: "Create a new post on DYNE",
};


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
              <Sidebar />
                <main className="flex-1 p-4">
                  {children}
                </main>
                <MainEffect words={['post']} />
            </div>
    )
}