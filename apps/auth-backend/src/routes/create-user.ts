import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { findPlayer } from '../lib/queries/find-player-auth.ts';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const createUserBodySchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(4),
  realName: z.string().or(z.null()),
  findout: z.string().or(z.null()),
});

export const createUserRoute = new Hono()
  .post('/register', zValidator('json', createUserBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const details = createUserBodySchema.parse(body);
    const { password, realName, findout, nickname } = details;

    const findedUser = await findPlayer({
      criteria: {
        NICKNAME: nickname,
      },
      extractedFields: ['HASH', 'UUID'],
    });

    if (!findedUser || !findedUser.UUID) {
      return ctx.json({ error: 'User not found' }, 404);
    }

    const { HASH, UUID } = findedUser

    const storedPassword = HASH;
    const uuid = UUID;

    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) {
      return ctx.json({ error: 'Invalid password' }, 401);
    }

    try {
      const user = await createUserTransaction({
        nickname, findout, real_name: realName ?? null, uuid
      })

      if (!user || !user.user_nickname) {
        return ctx.json({ error: 'Error in user create action' }, 400);
      }

      return ctx.json({ success: !!user }, 201);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });