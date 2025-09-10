import { throwError } from '#utils/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteFriendRequest } from "#lib/queries/friend/delete-friend-request.ts";
import { getNickname } from "#lib/modules/context.ts";
import { deleteFriendRequestSchema } from "@repo/types/schemas/friend/delete-friend-request-schema.ts";

export const deleteFriendRequestRoute = new Hono()
  .post("/remove-request", zValidator("json", deleteFriendRequestSchema), async (ctx) => {
    const { request_id } = deleteFriendRequestSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const res = await deleteFriendRequest({
        request_id, recipient: nickname
      });

      const data = {
        data: {
          request_id: res.id
        },
        status: "Friend request deleted"
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });