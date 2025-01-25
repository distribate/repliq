import { Hono } from "hono";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getCookie } from "hono/cookie";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { invalidateSession } from "../lib/queries/invalidate-session";
import { deleteSessionToken } from "../utils/delete-session-token";
import { deleteCookieToken } from "../utils/delete-cookie-token";

export const invalidateSessionRoute = new Hono()
  .post("/invalidate-session", async (ctx) => {
    const sessionToken = getCookie(ctx, "session")
    
    if (!sessionToken) {
      return ctx.json({ error: "Session token not found" }, 401)
    }

    try {
      const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
      const res = await invalidateSession(sessionId);

      if (!res) {
        return ctx.json({ error: "Internal Server Error" }, 500)
      }

      await deleteSessionToken(sessionToken)

      deleteCookieToken(ctx)
      
      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });