import type { Metadata } from "next";
import { geistSans } from "@/components/ui/fonts";
import "@/components/ui/globals.css";

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
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
