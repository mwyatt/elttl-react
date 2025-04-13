import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { decrypt } from './app/lib/session'

const protectedPath = '/admin'
const authenticationPath = '/admin/api'
const loginPath = '/login'
const publicRoutes = [loginPath]

export default async function middleware (req) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = path.indexOf(protectedPath) === 0
  const isAuthenticationRoute = path.indexOf(authenticationPath) === 0
  const isPublicRoute = publicRoutes.includes(path)
  const cookiePromise = await cookies()

  let jwt = cookiePromise.get('session')?.value
  let usedHeader = false

  // If not set in the cookie then it might be set in the header as an authentication token
  // If we are on the authentication route then we can use the header
  if (!jwt && isAuthenticationRoute) {
    usedHeader = true
    jwt = req.headers.get('authentication')
  }

  const session = await decrypt(jwt)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL(loginPath, req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL(protectedPath, req.nextUrl));
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}