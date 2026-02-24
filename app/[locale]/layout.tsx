import type { Metadata } from "next"
import { oswald } from "@/components/ui/fonts"
import "@/components/ui/globals.css"
import { Toaster } from "sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export const metadata: Metadata = {
  title: {
    template: "%s | DYNE",
    default: "DYNE",
  },
  description: "Social network & chat platform",
  icons: {
    icon: "/dyne-icon.svg",
  },
}

const theme = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('class', theme);
    } catch (error) {} 
  })()
`

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme }}></script>
      </head>
      <body className={`${oswald.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster position="top-center" theme="dark" />
        <SpeedInsights />
      </body>
    </html>
  )
}