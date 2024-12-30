import { Hono } from "hono";
import {
  findPlayer as findPlayerAuth,
  type FindPlayerExtractedColumns,
} from "../lib/queries/find-player-auth.ts";
import { HTTPException } from "hono/http-exception";
import { determinePlayerDetailType } from "../utils/determine-player-detail-type.ts";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const getAuthPlayerBodySchema = z.object({
  fields: z.custom<FindPlayerExtractedColumns>(),
});

export const getAuthUser = new Hono()
.post("/get/:detail", zValidator("json", getAuthPlayerBodySchema), async (ctx) => {
  const body = await ctx.req.json()
  const parsedBody = getAuthPlayerBodySchema.parse(body);
  const { detail } = ctx.req.param();
  const { fields: extractedFields } = parsedBody;

  if (!extractedFields || !extractedFields.length) {
    throw new HTTPException(401, {
      message: "Extracted fiels must be required",
    });
  }

  const detailType = determinePlayerDetailType(detail);

  if (detailType === "unknown") {
    throw new HTTPException(400, {
      message: "Player details must be uuid or nickname",
    });
  }

  let playerData = null;

  try {
    switch (detailType) {
      case "nickname":
        playerData = await findPlayerAuth({
          criteria: { NICKNAME: detail },
          extractedFields,
        });
        console.log(playerData);
        break;

      case "uuid":
        playerData = await findPlayerAuth({
          criteria: { UUID: detail },
          extractedFields,
        });
        break;
      }
  } catch (e) {
    console.error(e)
  }

  return ctx.json({ playerData }, 200);
});