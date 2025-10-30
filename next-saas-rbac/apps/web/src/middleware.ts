import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('🚀 VOA ~ middleware ~ pathname:', pathname)

  const response = NextResponse.next()

  console.log('ola mundo')

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')
    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (RFC 5785 well-known URIs)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
