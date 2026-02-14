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
            <MainEffect words={['naverande','oyy','yeees','odaaa', 'bananchikiiii']} numberCount={162} maxOpacity={0.5} />
        </main>
    )
}