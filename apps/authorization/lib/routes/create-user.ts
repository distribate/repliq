import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono';
import { authDB, forumDB } from '#db/db.ts';
import bcrypt from 'bcryptjs';

const app = new Hono();

export type UserDetails = {
  nickname: string,
  password: string,
  realName: string | null,
  findout: string
}

async function getUserAuthDetails(nickname: string) {
  return await authDB
  .selectFrom('AUTH')
  .where('NICKNAME', '=', nickname)
  .select([ 'HASH', 'UUID' ])
  .executeTakeFirst();
}

app.post('/register', async(c) => {
  const { nickname, password, realName: real_name, findout } = await c.req.json<UserDetails>();
  
  const result = await getUserAuthDetails(nickname)
  
  if (!result || !result.HASH) {
    throw new HTTPException(401, { message: 'Invalid name or password' });
  }
  
  const storedPassword = result.HASH;
  const uuid = result.UUID;
  
  const isPasswordValid = await bcrypt.compare(password, storedPassword);
  
  if (!isPasswordValid || !uuid) {
    throw new HTTPException(401, { message: 'Invalid name or password' });
  }
  
  const user = await forumDB.transaction().execute(async (trx) => {
    const user = await trx
    .insertInto('users')
    .values({ nickname, uuid, real_name: real_name ?? null })
    .returning("nickname")
    .executeTakeFirstOrThrow()
    
    return await trx
    .insertInto('info_findout')
    .values({ user_nickname: user.nickname, findout })
    .returning("user_nickname")
    .executeTakeFirst()
  })
  
  if (!user || !user.user_nickname) {
    throw new HTTPException(400, { message: 'Error in user create action' });
  }
  
  return c.json({ success: true }, 201)
});

export default app;