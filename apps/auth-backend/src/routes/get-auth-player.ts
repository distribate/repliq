import { Hono } from "hono";
import {
  findPlayer,
  type FindPlayerExtractedColumns,
} from "../lib/queries/find-player-auth.ts";
import { determinePlayerDetailType } from "../utils/determine-player-detail-type.ts";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const getAuthPlayerBodySchema = z.object({
  fields: z.custom<FindPlayerExtractedColumns>(),
});

export const getAuthUser = new Hono()
  .post("/get/:detail", zValidator("json", getAuthPlayerBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const parsedBody = getAuthPlayerBodySchema.parse(body);
    const { detail } = ctx.req.param();
    const { fields } = parsedBody;

    if (!fields || !fields.length) {
      return ctx.json({ error: "Extracted fields must be required" }, 400);
    }

    const detailType = determinePlayerDetailType(detail);

    if (detailType === "unknown") {
      return ctx.json({ error: "Player details must be uuid or nickname" }, 400);
    }

    try {
      switch (detailType) {
        case "nickname":
          const playerDataByNickname = await findPlayer({
            criteria: { NICKNAME: detail },
            extractedFields: fields,
          });

          return ctx.json({ data: playerDataByNickname }, 200);
        case "uuid":
          const playerDataByUuid = await findPlayer({
            criteria: { UUID: detail },
            extractedFields: fields,
          });

          return ctx.json({ data: playerDataByUuid }, 200);
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });