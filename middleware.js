import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // /admin/login 은 항상 통과
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')
  if (!session || session.value !== process.env.ADMIN_SESSION_SECRET) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
