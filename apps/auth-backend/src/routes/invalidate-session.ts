import { Hono } from "hono";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getCookie, setCookie } from "hono/cookie";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { invalidateSession } from "../lib/queries/invalidate-session";
import type { Context } from "hono";

export function deleteCookieToken(ctx: Context) {
  setCookie(ctx, `session`, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}

export function deleteCrossDomainCookie(ctx: Context) {
  setCookie(ctx, `user`, "", {
    httpOnly: true,
    sameSite: "lax",
    domain: "fasberry.su",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}

export const invalidateSessionRoute = new Hono()
  .post("/invalidate-session", async (ctx) => {
    const sessionToken = getCookie(ctx, "session")

    if (!sessionToken) {
      return ctx.json({ error: "Session token not found" }, 401)
    }

    try {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
      const res = await invalidateSession(sessionToken, sessionId);

      if (!res) {
        return ctx.json({ error: "Internal Server Error" }, 500)
      }

      deleteCookieToken(ctx)
      deleteCrossDomainCookie(ctx)

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });