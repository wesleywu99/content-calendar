import { NextResponse, type NextRequest } from 'next/server'

const COOKIE = 'app_access'

export function proxy(req: NextRequest) {
  const token = process.env.APP_ACCESS_TOKEN
  const qp = new URL(req.url).searchParams.get('token')
  const has = req.cookies.get(COOKIE)?.value === token
  if (token && (qp === token || has)) {
    const res = NextResponse.next()
    if (qp === token) res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/' })
    return res
  }
  return new NextResponse('需要存取權杖（在網址後加 ?token=…）', { status: 401 })
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
