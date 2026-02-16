import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request)
  
  const isAuthPage = request.nextUrl.pathname === '/' || 
                     request.nextUrl.pathname === '/login' || 
                     request.nextUrl.pathname === '/signup'
  
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }
  
  if (!user && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}