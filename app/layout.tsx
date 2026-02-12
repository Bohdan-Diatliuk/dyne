import type { Metadata } from "next";
import { oswald } from "@/components/ui/fonts";
import "@/components/ui/globals.css";
import { Toaster } from "sonner";
import NextAuthProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | DYNE",
    default: "DYNE",
  },
  description: "Social network & chat platform",
  icons: {
    icon: "/dyne-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.className} antialiased`}
      >
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
