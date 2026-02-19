import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request)
  
  const pathname = request.nextUrl.pathname
  
  const protectedRoutes = ['/feed', '/chat', '/profile', '/settings', '/post']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (!user && isProtected && pathname !== '/profile') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}