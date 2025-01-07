import { throwError } from "#helpers/throw-error.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteFriendRequest } from "#lib/queries/friend/delete-friend-request.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { deleteFriendRequestSchema } from "@repo/types/schemas/friend/delete-friend-request-schema.ts";

export const deleteFriendRequestRoute = new Hono()
  .post("/delete-friend-request", zValidator("json", deleteFriendRequestSchema), async (ctx) => {
    const body = await ctx.req.json();
    const result = deleteFriendRequestSchema.parse(body);

    const { request_id } = result
    const nickname = getNickname()

    try {
      await deleteFriendRequest({
        request_id, recipient: nickname
      });
      return ctx.json({ status: "Friend request deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
);