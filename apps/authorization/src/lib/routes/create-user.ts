import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono';
import { forumDB } from '#lib/db/db.ts';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { findPlayer as findPlayerAuth, findPlayer } from '#lib/queries/find-player-auth.ts';

export const createUserBodySchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(4),
  realName: z.string().or(z.null()),
  findout: z.string().or(z.null()),
});

export const createUserRoute = new Hono()
.post('/register', zValidator('json', createUserBodySchema), async(c) => {
  const result = createUserBodySchema.safeParse(await c.req.json());
  
  if (!result.success) {
    return c.json({ error: 'Invalid body' }, 400);
  }
  
  const body = await c.req.json<z.infer<typeof createUserBodySchema>>();
  
  const { password, realName, findout, nickname } = body;
  
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
  
  const user = await forumDB.transaction().execute(async(trx) => {
    const user = await trx
    .insertInto('users')
    .values({ nickname, uuid, real_name: realName ?? null })
    .returning('nickname')
    .executeTakeFirstOrThrow();
    
    return await trx
    .insertInto('info_findout')
    .values({ user_nickname: user.nickname, findout })
    .returning('user_nickname')
    .executeTakeFirst();
  });
  
  if (!user || !user.user_nickname) {
    throw new HTTPException(400, { message: 'Error in user create action' });
  }
  
  return c.json({ success: !!user }, 201);
})