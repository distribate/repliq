import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteFriendRequest } from "#lib/queries/friend/delete-friend-request.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { deleteFriendRequestSchema } from "@repo/types/schemas/friend/delete-friend-request-schema.ts";

export const deleteFriendRequestRoute = new Hono()
  .post("/delete-friend-request", zValidator("json", deleteFriendRequestSchema), async (ctx) => {
    const { request_id } = deleteFriendRequestSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const res = await deleteFriendRequest({
        request_id, recipient: nickname
      });

      if (!res[0].numDeletedRows) {
        return ctx.json({ error: "Error deleting friend request" }, 404);
      }

      return ctx.json({ status: "Friend request deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
);