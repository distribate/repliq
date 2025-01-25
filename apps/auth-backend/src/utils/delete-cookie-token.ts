import { setCookie } from "hono/cookie";
import type { Context } from "hono";

export function deleteCookieToken(ctx: Context) {
  return setCookie(ctx, `session`, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}