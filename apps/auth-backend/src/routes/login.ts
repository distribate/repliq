import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import { findPlayer } from "../lib/queries/find-player-auth.ts";
import { generateSessionToken } from "../utils/generate-session-token.ts";
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import { setCookie } from "hono/cookie";
import bcrypt from 'bcryptjs';
import { getClientIp } from "../utils/gen-client-ip.ts";
import { checkUserExists } from "../utils/check-user-exists.ts";
import type { Context } from "hono";
import type { Session } from "../types/session-type";
import type { User } from "../types/session-type.ts"

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

function setSessionCookie(ctx: Context, token: string, expires: Date) {
  return setCookie(ctx, `session`, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  })
}

function setCrossDomainSessionCookie(ctx: Context, nickname: string, expires: Date) {
  return setCookie(ctx, `user`, nickname, {
    httpOnly: true,
    sameSite: "lax",
    domain: "fasberry.su",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  })
}

export const loginRoute = new Hono()
  .post("/login", zValidator("json", createSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const { info, details: { nickname, password } } = createSessionBodySchema.parse(body)

    const isExistsOnForum = await checkUserExists(nickname)

    if (!isExistsOnForum) {
      return ctx.json({ error: "User not found on the forum" }, 404)
    }

    const user = await findPlayer({
      criteria: { NICKNAME: nickname },
      extractedFields: ["HASH"],
    });

    if (!user) {
      return ctx.json({ error: "User not found on the server" }, 404);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.HASH)

    if (!isPasswordValid) {
      return ctx.json({ error: "Invalid password" }, 401);
    }

    const token = generateSessionToken();

    const ip = getClientIp(ctx)

    try {
      const createdSession = await createSessionTransaction({
        token, nickname, info: { ...info, ip }
      })

      setSessionCookie(ctx, token, new Date(createdSession.expires_at))
      setCrossDomainSessionCookie(ctx, nickname, new Date(createdSession.expires_at))

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })