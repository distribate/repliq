import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { validatePasswordSafe } from '../utils/validate-password-safe.ts';
import { generateOfflineUUID } from '../utils/generate-offline-uuid.ts';
import { validateIpRestricts } from '../utils/validate-ip-restricts.ts';
import { getClientIp } from '../utils/gen-client-ip.ts';
import { checkUserExists } from "../utils/check-user-exists.ts";
import { registerSchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import ky, { HTTPError } from 'ky';

type PremiumUser = {
  uuid: string,
  username: string
}

type MojangError = {
  code: number,
  error: string,
  reason: string
}

const MOJANG_API_URL = "https://api.ashcon.app/mojang/v2/user"

const CLOUDFLARE_TURNSTILE_SECRET_KEY = "0x4AAAAAAA-stfzoKM9_11nOW5V0dd54VS0"

export const registerRoute = new Hono()
  .post('/register', zValidator('json', registerSchema), async (ctx) => {
    const {
      password,
      details: { findout, realName: real_name, referrer },
      nickname,
      token
    } = registerSchema.parse(await ctx.req.json());
 
    if (!token) {
      return ctx.json({ error: "Token is not provided" }, 400)
    }

    const verifyRes = await ky.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      json: { secret: CLOUDFLARE_TURNSTILE_SECRET_KEY, response: token },
    });

    if (!verifyRes.ok) {
      return ctx.json({ error: "Ошибка капчи" }, 403);
    }

    const result = await verifyRes.json();
    
    console.log(result)

    const IP = getClientIp(ctx) ?? "1.1.1.1"

    const isValid = await validateIpRestricts(IP)

    if (isValid) {
      return ctx.json({ error: "IP already exists" }, 400)
    }

    const isExistsOnForum = await checkUserExists(nickname)

    if (isExistsOnForum) {
      return ctx.json({ error: "User already exists" }, 400)
    }

    const isPasswordSafe = validatePasswordSafe(password)

    if (!isPasswordSafe) {
      return ctx.json({ error: 'Unsafe password' }, 401);
    }

    const HASH = Bun.password.hashSync(password, {
      algorithm: "bcrypt", cost: 10
    })

    let user: PremiumUser | null;

    try {
      user = await ky
        .get(`${MOJANG_API_URL}/${nickname}`)
        .json<PremiumUser>();
    } catch (e) {
      if (e instanceof HTTPError) {
        const error = await e.response.json<MojangError>();

        if (error.reason.includes("User not found")) {
          return ctx.json({ error: "Nickname invalid" }, 400);
        }

        user = null
      }
      user = null
    }

    const offlineUUID = generateOfflineUUID(nickname);

    user = {
      uuid: offlineUUID,
      username: nickname
    }

    try {
      const registered = await createUserTransaction({
        nickname, findout, real_name, HASH, IP, referrer,
        UUID: user.uuid,
        LOWERCASENICKNAME: nickname.toLowerCase(),
        NICKNAME: nickname,
        REGDATE: new Date().getTime()
      })

      if (!registered || !registered.user_nickname) {
        return ctx.json({ error: 'Error in creating user' }, 400);
      }

      return ctx.json({ status: "Success" }, 201);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });