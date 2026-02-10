import Link from "next/link";

export default function Header() {
    return (
    <header>
        <nav className="flex justify-between p-10 bg-zinc-950 text-zinc-300">
            <h1>DYNE</h1>
            <nav className="space-x-10 uppercase">
                <Link href="/" className="hover:text-white">Home</Link>
                <Link href="/about" className="hover:text-white">About</Link>
                <Link href="/contact" className="hover:text-white">Contact</Link>
                <Link href="/services" className="hover:text-white">Services</Link>
            </nav>
        </nav>
    </header>
    );
}