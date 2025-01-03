import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { friendRequestSchema } from "./create-friend-request";
import { throwError } from "#helpers/throw-error.ts";

const deleteFriendSchema = z.object({
  friend_id: z.string(),
}).merge(friendRequestSchema.pick({
  currentUserNickname: true,
}))

async function deleteFriend({
  friend_id, currentUserNickname,
}: z.infer<typeof deleteFriendSchema>) {
  return await forumDB
  .deleteFrom('users_friends')
  .where("id", "=", friend_id)
  .where((eb) => eb.or([
    eb('user_1', '=', currentUserNickname),
    eb('user_2', '=', currentUserNickname),
  ]))
  .execute();
}

export const deleteFriendRoute = new Hono()
  .delete("/delete-friend", zValidator("json", deleteFriendSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = deleteFriendSchema.parse(body);

    try {
      await deleteFriend(result);
      return ctx.json({ status: "Friend deleted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e), }, 400);
    }
  }
);