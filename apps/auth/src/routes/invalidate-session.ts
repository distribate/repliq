import { Hono } from "hono";
import { throwError } from '#utils/throw-error.ts';
import { getCookie, setCookie } from "hono/cookie";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { Context } from "hono";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details";
import { destroySession, getSession } from "../utils/auth";
import { isProduction } from "#shared/env/index.ts";

export function deleteCookiesToken(ctx: Context) {
  setCookie(ctx, SESSION_KEY, "", {
    httpOnly: true,
    sameSite: "None",
    secure: isProduction,
    domain: isProduction ? SESSION_DOMAIN : "localhost",
    maxAge: 0,
    path: "/",
  })
}

export const invalidateSessionRoute = new Hono()
  .post("/invalidate-session", async (ctx) => {
    const sessionToken = getCookie(ctx, SESSION_KEY)

    if (!sessionToken) {
      return ctx.json({ error: "Session token not found" }, 401)
    }

    let sessionDetails: { nickname: string; ip: string; } | null = null;

    try {
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(sessionToken))
      );

      sessionDetails = await getSession(sessionId);

      await destroySession(sessionToken);

      if (sessionDetails) {
        sessionDetails = null;
      }

      deleteCookiesToken(ctx)

      return ctx.json({ data: { status: "Success" } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });