import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Post",
    description: "Create a new post on DYNE",
};


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            {children}
        </main>
    )
}