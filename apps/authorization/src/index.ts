import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { authorizeToken } from '#utils/authorize-token.ts';
import { getAuthPlayerBodySchema } from './lib/routes/get-auth-player.ts';
import { createUserBodySchema } from './lib/routes/create-user.ts';
import { createSessionBodySchema } from './lib/routes/create-session.ts';
import { invalidateSessionBodySchema } from './lib/routes/invalidate-session.ts';
import { validateSessionBodySchema } from './lib/routes/validate-session.ts';
import { hc } from 'hono/client';
import { showRoutes } from 'hono/dev';
import { zValidator } from '@hono/zod-validator';
import { findPlayer as findPlayerLP } from '#lib/queries/find-player-luckperms.ts';
import { findPlayer as findPlayerAuth } from '#lib/queries/find-player-auth.ts';
import { HTTPException } from 'hono/http-exception';
import { generateSessionToken } from '#utils/generate-session-token.ts';
import { forumDB } from '#lib/db/db.ts';
import { insertSessionInfo } from '#lib/queries/insert-session-info.ts';
import { createSession } from '#utils/create-session.ts';
import { z } from 'zod';
import { determinePlayerDetailType } from '#utils/determine-player-detail-type.ts';
import { validateSessionToken } from '#utils/validate-session-token.ts';
import { invalidateSession } from '#utils/invalidate-session.ts';
import { SECRET_TOKEN } from '#utils/initialize-env.ts';
import bcrypt from 'bcryptjs';

const port = process.env.SERVICE_PORT;

type LPRouteType = typeof lp;
type AuthRouteType = typeof auth;

const auth = new Hono()
.post('/auth/create-session', zValidator('json', createSessionBodySchema), async(c) => {
  const result = createSessionBodySchema.safeParse(await c.req.json());
  
  if (!result.success) {
    return c.json({ error: 'Invalid body' }, 400);
  }
  
  const { details: authDetails, info } = result.data;
  const { userId, password, nickname } = authDetails;
  
  const user = await findPlayerAuth({
    criteria: {
      NICKNAME: nickname,
    },
    extractedFields: [ 'HASH' ],
  });
  
  if (!user) {
    throw new HTTPException(400, { message: 'User not found' });
  }
  
  const isPasswordValid = bcrypt.compareSync(password, user.HASH);
  
  if (!isPasswordValid) {
    throw new HTTPException(400, { message: 'Invalid password' });
  }
  
  const token = generateSessionToken();
  
  try {
    const createdSession = await forumDB.transaction().execute(async(trx) => {
      const session = await createSession({
        trx,
        details: { token, userId },
      });
      
      await insertSessionInfo({
        trx,
        details: { session_id: session.session_id, ...info },
      });
      
      return session;
    });
    
    return c.json(
      {
        token,
        expiresAt: createdSession.expires_at,
      },
      200,
    );
  } catch {
    throw new HTTPException(500, { message: 'Internal Server Error' });
  }
})
.post('/auth/get/:detail', zValidator('json', getAuthPlayerBodySchema), async(c) => {
    const parsedBody = getAuthPlayerBodySchema.safeParse(await c.req.json());
    
    if (!parsedBody.success) {
      return c.json({ error: 'Invalid body' }, 400);
    }
    
    const { detail } = c.req.param();
    const body = await c.req.json<z.infer<typeof getAuthPlayerBodySchema>>();
    
    const { fields: extractedFields } = body;
    
    if (!extractedFields || !extractedFields.length) {
      throw new HTTPException(401, { message: 'Extracted fiels must be required' });
    }
    
    const detailType = determinePlayerDetailType(detail);
    
    if (detailType === 'unknown') {
      throw new HTTPException(400, { message: 'Player details must be uuid or nickname' });
    }
    
    try {
      let playerData = null;
      
      switch(detailType) {
        case 'nickname':
          playerData = await findPlayerAuth({
            criteria: { NICKNAME: detail },
            extractedFields,
          });
          break;
        
        case 'uuid':
          playerData = await findPlayerAuth({
            criteria: { UUID: detail },
            extractedFields,
          });
          break;
      }
      
      return c.json({ data: playerData });
    } catch (err) {
      throw new HTTPException(500, { message: 'Internal Server Error' });
    }
  },
)
.post('/auth/register', zValidator('json', createUserBodySchema), async(c) => {
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
  
  return c.json({ success: true }, 201);
})
.post('/auth/invalidate-session', zValidator('json', invalidateSessionBodySchema), async(c) => {
  const result = invalidateSessionBodySchema.safeParse(await c.req.json());
  
  if (!result.success) {
    return c.json({ error: 'Invalid body' }, 400);
  }
  
  const body = await c.req.json<z.infer<typeof invalidateSessionBodySchema>>();
  const res = await invalidateSession(body.sessionId);
  
  return c.json({ success: !!res }, 200);
})
.post('/auth/validate-session', zValidator('json', validateSessionBodySchema), async(c) => {
  const result = validateSessionBodySchema.safeParse(await c.req.json());
  
  if (!result.success) {
    return c.json({ error: 'Invalid body' }, 400);
  }
  
  const body = await c.req.json<z.infer<typeof validateSessionBodySchema>>();
  
  const { token } = body;
  const { session, user } = await validateSessionToken(token);
  
  return c.json({ session, user }, 200);
});

const lp = new Hono()
.get('/lp/:detail', async(c) => {
  const { detail } = c.req.param();
  
  const detailType = determinePlayerDetailType(detail);
  
  if (detailType === 'unknown') {
    throw new HTTPException(400, { message: 'Player details must be uuid or nickname' });
  }
  
  switch(detailType) {
    case 'nickname':
      const playerByNickname = await findPlayerLP({ username: detail });
      
      return c.json({ data: playerByNickname ?? null });
    case 'uuid':
      const playerByUUID = await findPlayerLP({ uuid: detail });
      
      return c.json({ data: playerByUUID ?? null });
  }
});

const app = new Hono()
.use('*', prettyJSON())
.use('*', (c, next) => {
  const authHeader = c.req.header('Authorization');
  authorizeToken(authHeader);
  return next();
})
.route('/', auth)
.route('/', lp)
.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  
  return c.json({ error: 'Internal Server Error' }, 500);
});

const headers = {
  'Authorization': `Bearer ${SECRET_TOKEN}`,
};

export const authClient = hc<AuthRouteType>('http://localhost:3400', { headers });
export const lpClient = hc<LPRouteType>('http://localhost:3400', { headers });

showRoutes(app, {
  verbose: false, colorize: true,
});

export default { port, fetch: app.fetch };