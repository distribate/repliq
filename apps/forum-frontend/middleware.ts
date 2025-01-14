import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isValidOrigin(oh: string, hh: string): boolean {
  try {
    const origin = new URL(oh);
    return origin.host === hh;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.method === "GET") {
    const token = req.cookies.get("session")?.value ?? null;

    if (token !== null) {
      res.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax", 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return res;
  }
  
  const oh = req.headers.get("Origin");
  const hh = req.headers.get("X-Forwarded-Host");

  if (!oh || !hh || !isValidOrigin(oh, hh)) {
    return new NextResponse(null, { status: 403 });
  }

  if (!req.cookies.has("alerts-status")) {
    res.cookies.set("alerts-status", "show");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};