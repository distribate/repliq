import { Hono } from "hono";
import { findPlayer as findPlayerLP } from "../lib/queries/find-player-luckperms.ts";
import { determinePlayerDetailType } from "../utils/determine-player-detail-type.ts";
import { HTTPException } from "hono/http-exception";
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const getLuckpermsPlayer = new Hono()
  .get("/:detail", async (ctx) => {
    const { detail } = ctx.req.param();

    const detailType = determinePlayerDetailType(detail);

    if (detailType === "unknown") {
      throw new HTTPException(400, {
        message: "Player details must be uuid or nickname",
      });
    }

    try {
      switch (detailType) {
        case "nickname":
          const playerByNickname = await findPlayerLP({ username: detail });

          return ctx.json({ data: playerByNickname ?? null });
        case "uuid":
          const playerByUUID = await findPlayerLP({ uuid: detail });

          return ctx.json({ data: playerByUUID ?? null });
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });