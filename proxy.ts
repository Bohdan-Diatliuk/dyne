import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request)
  if (intlResponse) return intlResponse

  const { user, response } = await updateSession(request)

  const pathname = request.nextUrl.pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(uk|en)/, "") || "/"

  const protectedRoutes = ["/feed", "/chat", "/profile", "/settings", "/post"]
  const isProtected = protectedRoutes.some(route =>
    pathnameWithoutLocale.startsWith(route)
  )

  if (!user && isProtected && pathnameWithoutLocale !== "/profile") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}