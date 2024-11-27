import { Hono } from 'hono';
import { findPlayer } from '#lib/queries/find-player-auth.ts';
import { HTTPException } from 'hono/http-exception';
import { determinePlayerDetailType } from '#utils/determine-player-detail-type.ts';

const app = new Hono()

app.get(":detail", async (c) => {
  const { detail } = c.req.param();
  
  const detailType = determinePlayerDetailType(detail);
  
  if (detailType === 'unknown') {
    throw new HTTPException(400, { message: "Player details must be uuid or nickname" });
  }
  
  switch(detailType) {
    case 'nickname':
      const playerByNickname = await findPlayer({ NICKNAME: detail })
      
      return c.json({ data: playerByNickname ?? null });
    case 'uuid':
      const playerByUUID = await findPlayer({ UUID: detail })
      
      return c.json({ data: playerByUUID ?? null });
  }
})

export default app;