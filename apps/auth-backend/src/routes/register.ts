import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { validatePasswordSafe } from '../utils/validate-password-safe.ts';
import { checkUserExists } from "../utils/check-user-exists.ts";
import { registerSchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import { validateAuthenticationRequest } from '../lib/validators/validate-authentication-request.ts';
import { validateExistsUser } from '../lib/validators/validate-exists-user.ts';

export const registerRoute = new Hono()
  .post('/register', zValidator('json', registerSchema), async (ctx) => {
    const { 
      password, findout, referrer, nickname, token 
    } = registerSchema.parse(await ctx.req.json());

    await validateAuthenticationRequest({ ctx, token })

    const isExistsOnForum = await validateExistsUser({ nickname })

    if (isExistsOnForum.result) {
      return ctx.json({ error: "User already exists" }, 400)
    }

    const isPasswordSafe = validatePasswordSafe(password)

    if (!isPasswordSafe) {
      return ctx.json({ error: 'Unsafe password' }, 401);
    }

    try {
      const result = await createUserTransaction({ findout, nickname, referrer, password })

      if (!result || !result.nickname) {
        return ctx.json({ error: 'Error in creating user' }, 400);
      }

      return ctx.json({ status: "Success" }, 201);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });