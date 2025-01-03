import { throwError } from "#helpers/throw-error.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { friendRequestSchema } from "./create-friend-request";
import { forumDB } from "#shared/database/forum-db.ts"

const acceptFriendRequestSchema = friendRequestSchema.pick({
  currentUserNickname: true,
  friend_id: true
})

async function acceptFriendRequestTransaction(currentUserNickname: string, friend_id: string) {
  return await forumDB.transaction().execute(async(trx) => {
    const deleteRequest = await trx
    .deleteFrom('friends_requests')
    .where("id", "=", friend_id)
    .where((eb) => eb.or([
      eb('initiator', '=', currentUserNickname),
      eb('recipient', '=', currentUserNickname),
    ]))
    .returning(["recipient"])
    .executeTakeFirstOrThrow();

    return await trx
    .insertInto('users_friends')
    .values({
      user_1: currentUserNickname,
      user_2: deleteRequest.recipient
    })
    .executeTakeFirstOrThrow();
  });
}

export const acceptFriendRequestRoute = new Hono()
  .post("/accept-friend-request", zValidator("json", acceptFriendRequestSchema), async (ctx) => {
    const { currentUserNickname, friend_id } = await ctx.req.json();

    try {
      await acceptFriendRequestTransaction(currentUserNickname, friend_id)

      return ctx.json({ status: "Friend request accepted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
);