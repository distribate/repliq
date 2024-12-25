import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestOrigin } from "lucia";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";

export async function middleware(request: NextRequest) {
  if (request.method === "GET") {
    const response = NextResponse.next();

    const token = request.cookies.get("session")?.value ?? null;

    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }
  
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("X-Forwarded-Host");

  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, { status: 403 });
  }

  let origin: URL;

  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, { status: 403 });
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, { status: 403 });
  }
  
  const hasAlertsShowing = request.cookies.has(ALERTS_COOKIE_KEY);
  const response = NextResponse.next();

  if (!hasAlertsShowing) {
    response.cookies.set(ALERTS_COOKIE_KEY, "show");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
