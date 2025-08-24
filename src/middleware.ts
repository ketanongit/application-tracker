import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/category-wise', '/application', '/quick-addition']
const AUTH_COOKIE = 'job-tracker-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  
  if (isProtected) {
    const authCookie = request.cookies.get(AUTH_COOKIE)
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
