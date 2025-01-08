import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";

function isValidOrigin(originHeader: string, hostHeader: string): boolean {
  try {
    const origin = new URL(originHeader);
    return origin.host === hostHeader;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.method === "GET") {
    const token = request.cookies.get("session")?.value ?? null;

    if (token !== null) {
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

  if (!originHeader || !hostHeader || !isValidOrigin(originHeader, hostHeader)) {
    return new NextResponse(null, { status: 403 });
  }

  if (!request.cookies.has(ALERTS_COOKIE_KEY)) {
    response.cookies.set(ALERTS_COOKIE_KEY, "show");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
