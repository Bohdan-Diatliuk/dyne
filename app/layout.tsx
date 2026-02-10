import type { Metadata } from "next";
import { geistSans } from "@/components/ui/fonts";
import "@/components/ui/globals.css";

export const metadata: Metadata = {
  title: "%s | DYNE",
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
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
