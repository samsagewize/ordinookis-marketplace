import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const url = req.nextUrl.clone()

  if (host.startsWith('micasita.ordinooki.wtf') && url.pathname === '/') {
    url.pathname = '/showcase/micasita'
    return NextResponse.rewrite(url)
  }
  if (host.startsWith('demo1.ordinooki.wtf') && url.pathname === '/') {
    url.pathname = '/showcase/demo1'
    return NextResponse.rewrite(url)
  }
  if (host.startsWith('demo2.ordinooki.wtf') && url.pathname === '/') {
    url.pathname = '/showcase/demo2'
    return NextResponse.rewrite(url)
  }
  if (host.startsWith('demo3.ordinooki.wtf') && url.pathname === '/') {
    url.pathname = '/showcase/demo3'
    return NextResponse.rewrite(url)
  }
  if (host.startsWith('musa.ordinooki.wtf') && url.pathname === '/') {
    url.pathname = '/showcase/musa'
    return NextResponse.rewrite(url)
  }
  if (host.startsWith('puertocriollo.ordinooki.wtf') && url.pathname === '/') {
    url.pathname = '/showcase/puertocriollo'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
