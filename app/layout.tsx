import type { Metadata } from "next";
import { geistSans, oswald } from "@/components/ui/fonts";
import "@/components/ui/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | DYNE",
    default: "DYNE",
  },
  description: "Social network & chat platform",
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
        {children}
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
