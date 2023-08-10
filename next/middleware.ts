import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value
  console.warn('next.js middleware: ', request.url, token)

  if (token) {
    try {
      const response = NextResponse.next()
      response.cookies.set('token', token)

      return response
    } catch (error) {
      return NextResponse.redirect(new URL('/error', request.url))
    }
  } else {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!login|register).*)',
}
