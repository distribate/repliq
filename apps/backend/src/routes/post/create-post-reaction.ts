import { createReaction, createReactionRouteSchema } from "#lib/queries/reaction/create-reaction.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "#utils/throw-error.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const createPostReactionRoute = new Hono()
  .post("/reaction/:id", zValidator("json", createReactionRouteSchema), async (ctx) => {
    const nickname = getNickname();
    const id = ctx.req.param("id")
    const { emoji } = createReactionRouteSchema.parse(await ctx.req.json())

    try {
      const data = await createReaction(nickname, "post", { id, emoji });

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })