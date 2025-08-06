import dayjs from '@repo/lib/constants/dayjs-instance';
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import { setCookie } from "hono/cookie";
import bcrypt from 'bcryptjs';
import { getClientIp } from "../utils/get-client-ip.ts";
import type { Session } from "../types/session-type";
import { isProduction } from "@repo/lib/helpers/is-production.ts";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details.ts";
import { validateAuthenticationRequest } from "../lib/validators/validate-authentication-request.ts";
import { logger } from "@repo/lib/utils/logger.ts";
import { validateExistsUser } from "../lib/validators/validate-exists-user.ts";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { UAParser } from "ua-parser-js"
import type { Selectable } from 'kysely';
import type { Users } from '@repo/types/db/forum-database-types.ts';

export type SessionValidationResult =
  | { session: Session; user: Selectable<Pick<Users, "id" | "nickname">> }
  | { session: null; user: null };

function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export const loginRoute = new Hono()
  .post("/login", zValidator("json", createSessionBodySchema), async (ctx) => {
    const { nickname, password, token: cfToken } = createSessionBodySchema.parse(await ctx.req.json())

    const { 
      browser: { name: browserName }, 
      os: { name: osName }, 
      cpu: { architecture: cpuArch }, 
      device: { model: deviceModel },
      ua 
    } = UAParser(ctx.req.header("User-Agent"))

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

    const token = generateSessionToken();
    const ip = getClientIp(ctx)

    if (!ip) {
      return ctx.json({ error: "Invalid ip" }, 401);
    }

    try {
      const createdSession = await createSessionTransaction({
        token, nickname, 
        browser: browserName || "Unknown",
        cpu: cpuArch || "Unknown",
        device: deviceModel || "Unknown", 
        os: osName || "Unknown", 
        ua, 
        ip
      })

      if (createdSession) {
        const expires = new Date(createdSession.expires_at)
  
        logger.info(`${nickname} logged. Ip: ${ip} Time: ${dayjs().format("DD-MM-YYYY HH:mm:ss")}`)
  
        setCookie(ctx, SESSION_KEY, token, {
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
      if (e instanceof Error) {
        logger.error(e.message)
      }
      
      return ctx.json({ error: throwError(e) }, 500)
    }
  })