import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { deleteFriend } from "#lib/queries/friend/delete-friend.ts";
import { deleteFriendSchema } from "@repo/types/schemas/friend/delete-friend-schema.ts";

export const removeFriendRoute = new Hono()
  .delete("/remove", zValidator("json", deleteFriendSchema), async (ctx) => {
    const result = deleteFriendSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const res = await deleteFriend({ ...result, nickname });

      if (!res.numDeletedRows) {
        return ctx.json({ error: "Error deleting friend" }, 404);
      }

      const data = {
        data: true,
        status: "Friend deleted"
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e), }, 400);
    }
  });