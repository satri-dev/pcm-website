import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/core/lib/auth"
import { headers } from "next/headers"

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const isPublicPath =
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/test-2fa") ||
    /\.(ico|png|jpg|svg|css|js|json|txt)$/.test(pathname)

  if (!session) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  const needs2FA = !session.user.twoFactorEnabled
  const is2FAPath = pathname === "/enable-2fa" || pathname === "/two-factor"

  if (needs2FA) {
    if (pathname === "/two-factor") {
      return NextResponse.redirect(new URL("/enable-2fa", request.url))
    }
    if (!is2FAPath && !isPublicPath) {
      return NextResponse.redirect(new URL("/enable-2fa", request.url))
    }
  } else {
    if (is2FAPath) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*", "/viewer/:path*", "/enable-2fa"],
}
