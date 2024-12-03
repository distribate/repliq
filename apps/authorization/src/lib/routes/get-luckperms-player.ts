import { Hono } from 'hono';
import { findPlayer as findPlayerLP } from '#lib/queries/find-player-luckperms.ts';
import { determinePlayerDetailType } from '#utils/determine-player-detail-type.ts';
import { HTTPException } from 'hono/http-exception';

export const getLuckpermsPlayer = new Hono()
.get('/:detail', async(c) => {
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
})