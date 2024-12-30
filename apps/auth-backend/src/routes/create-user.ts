import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  findPlayer as findPlayerAuth
} from '../lib/queries/find-player-auth.ts';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';

export const createUserBodySchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(4),
  realName: z.string().or(z.null()),
  findout: z.string().or(z.null()),
});

export const createUserRoute = new Hono()
.post('/register', zValidator('json', createUserBodySchema), async(ctx) => {
  const body = await ctx.req.json()
  const details = createUserBodySchema.parse(body);
  const { password, realName, findout, nickname } = details;
    
  const findedUser = await findPlayerAuth({
    criteria: {
      NICKNAME: nickname,
    },
    extractedFields: [ 'HASH', 'UUID' ],
  });
    
  if (!findedUser || !findedUser.UUID) {
    throw new HTTPException(401, { message: 'User not found' });
  }
    
  const storedPassword = findedUser.HASH;
  const uuid = findedUser.UUID;
    
  const isPasswordValid = await bcrypt.compare(password, storedPassword);
    
  if (!isPasswordValid) {
    throw new HTTPException(401, { message: 'Invalid password' });
  }
    
  const user = await createUserTransaction({
    nickname, findout, real_name: realName ?? null, uuid
  })
    
  if (!user || !user.user_nickname) {
    throw new HTTPException(400, { message: 'Error in user create action' });
  }
    
  return ctx.json({ success: !!user }, 201);
});