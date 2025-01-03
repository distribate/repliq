import { throwError } from "#helpers/throw-error.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { friendRequestSchema } from "./create-friend-request";
import { deleteFriendRequest } from "#lib/queries/delete-friend-request.ts";

const deleteFriendRequestSchema = friendRequestSchema.pick({
  currentUserNickname: true,
  friend_id: true
})

export const deleteFriendRequestRoute = new Hono()
  .post("/delete-friend-request", zValidator("json", deleteFriendRequestSchema), async (ctx) => {
    const { currentUserNickname, friend_id } = await ctx.req.json();

    try {
      await deleteFriendRequest(currentUserNickname,friend_id);
      return ctx.json({ status: "Friend request deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
);