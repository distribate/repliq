import { Hono } from 'hono';
import { findPlayer } from '#lib/queries/find-player-luckperms.ts';
import { determinePlayerDetailType } from '#utils/determine-player-detail-type.ts';
import { HTTPException } from 'hono/http-exception';

const app = new Hono()
.get(":detail", async (c) => {
  const { detail } = c.req.param();
  
  const detailType = determinePlayerDetailType(detail);
  
  if (detailType === 'unknown') {
    throw new HTTPException(400, { message: "Player details must be uuid or nickname" });
  }

  switch(detailType) {
    case 'nickname':
      const playerByNickname = await findPlayer({ username: detail })
      
      return c.json({ data: playerByNickname ?? null });
    case 'uuid':
      const playerByUUID = await findPlayer({ uuid: detail })
      
      return c.json({ data: playerByUUID ?? null });
  }
})

export { app };