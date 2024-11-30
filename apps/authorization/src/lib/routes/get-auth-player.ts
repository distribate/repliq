import { Hono } from 'hono';
import { findPlayer, type FindPlayerExtractedColumns } from '#lib/queries/find-player-auth.ts';
import { HTTPException } from 'hono/http-exception';
import { determinePlayerDetailType } from '#utils/determine-player-detail-type.ts';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const getAuthPlayerBodySchema = z.object({
  fields: z.custom<FindPlayerExtractedColumns>(),
});

export const app = new Hono().post(
  ':detail', zValidator('json', getAuthPlayerBodySchema),
  async(c) => {
    const parsedBody = getAuthPlayerBodySchema.safeParse(await c.req.json())
    
    if (!parsedBody.success) {
      return c.text('Invalid body', 400);
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
          playerData = await findPlayer({
            criteria: { NICKNAME: detail },
            extractedFields,
          });
          break;
        
        case 'uuid':
          playerData = await findPlayer({
            criteria: { UUID: detail },
            extractedFields,
          });
          break;
      }
      
      return c.json({ data: playerData ?? null });
    } catch (err) {
      throw new HTTPException(500, { message: 'Internal Server Error' });
    }
  },
);