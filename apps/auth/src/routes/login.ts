import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import { setCookie } from "hono/cookie";
import { getClientIp } from "../utils/get-client-ip.ts";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details.ts";
import { validateAuthenticationRequest } from "../lib/validators/validate-authentication-request.ts";
import { validateExistsUser } from "../lib/validators/validate-exists-user.ts";
import { UAParser } from "ua-parser-js"
import type { Selectable } from 'kysely';
import type { Users } from '@repo/types/db/forum-database-types.ts';
import bcrypt from 'bcryptjs';
import type { Session } from "../utils/auth.ts";
import { isProduction } from "#helpers/is-production.ts";

export type SessionValidationResult =
  | { session: Session; user: Selectable<Pick<Users, "id" | "nickname">> }
  | { session: null; user: null };

export const loginRoute = new Hono()
  .post("/login", zValidator("json", createSessionBodySchema), async (ctx) => {
    const { nickname, password, token: cfToken } = createSessionBodySchema.parse(await ctx.req.json())
    const { browser, os, cpu, device, ua } = UAParser(ctx.req.header("User-Agent"))

    try {
      await validateAuthenticationRequest({ ctx, token: cfToken })
    } catch (e) {
      console.error(e)
    }

    const existsUser = await validateExistsUser({ nickname, withCredentials: true })
    const user = existsUser.data

    if (!existsUser.result || !user) {
      return ctx.json({ error: "Not found" }, 404);
    }

    if (user.account_status === 'deleted') {
      return ctx.json({ error: "User deleted" }, 401);
    }

    const isValid = bcrypt.compareSync(password, user.hash)

    if (!isValid) {
      return ctx.json({ error: "Invalid password" }, 401);
    }

    const ip = getClientIp(ctx)

    if (!ip) {
      return ctx.json({ error: "Invalid ip" }, 401);
    }

    try {
      const createdSession = await createSessionTransaction({
        nickname, browser: browser.name, cpu: cpu.architecture, device: device.model, os: os.name, ua, ip
      })

      if (createdSession) {
        const expires = createdSession.expires_at

        setCookie(ctx, SESSION_KEY, createdSession.token, {
          httpOnly: true,
          sameSite: isProduction ? "None" : "Lax",
          secure: isProduction,
          expires,
          path: "/",
          domain: isProduction ? SESSION_DOMAIN : "localhost"
        })

        return ctx.json({ status: "Success" }, 200)
      }

      return ctx.json({ error: "Session not created" }, 500)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })