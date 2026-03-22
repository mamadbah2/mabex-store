import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Décoder le payload du JWT (base64) pour extraire le rôle
    // Le JWT est au format: header.payload.signature
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) throw new Error("Token malformé")
      
    const payloadString = atob(payloadBase64)
    const payload = JSON.parse(payloadString)

    const path = request.nextUrl.pathname

    if (path.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (path.startsWith('/seller') && payload.role !== 'seller' && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    // Si le token est invalide ou illisible, on redirige vers le login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
  ],
}
