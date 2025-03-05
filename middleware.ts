import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get("auth-token")?.value

  // If the token doesn't exist and the path is protected, redirect to signin
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  try {
    // Verify the token
    if (token) {
      verify(token, JWT_SECRET)
    }
    return NextResponse.next()
  } catch (error) {
    // If token is invalid, clear it and redirect to signin
    const response = NextResponse.redirect(new URL("/signin", request.url))
    response.cookies.delete("auth-token")
    return response
  }
}

export const config = {
  matcher: "/dashboard/:path*",
}

