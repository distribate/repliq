import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const addFriendSchema = z.object({
  requestedUserNickname: z.string(),
  currentUserNickname: z.string()
})

async function validateUserFriendPreference(nickname: string): Promise<boolean> {
  const query = await forumDB
  .selectFrom('users_settings')
  .select("accept_friend_request")
  .where('nickname', '=', nickname)
  .executeTakeFirstOrThrow();

  return query.accept_friend_request
}

async function createFriendRequest(currentUserNickname: string, requestedUserNickname: string) {
  return await forumDB
  .insertInto('users_friends')
  .values({ 
    user_1: currentUserNickname, 
    user_2: requestedUserNickname
  })
  .returningAll()
  .executeTakeFirstOrThrow();
}

export const addFriendRoute = new Hono()
  .post("/add-friend", zValidator("json", addFriendSchema), async (ctx) => {
    const body = await ctx.req.json()

    const result = addFriendSchema.parse(body)
    const { currentUserNickname, requestedUserNickname } = result;
    
    if (!validateUserFriendPreference(requestedUserNickname)) {
      return ctx.json({
        error: "User does not have accept to send friend request"
      }, 200)
    }

    if (currentUserNickname === requestedUserNickname) {
      return ctx.json({
        error: "You cannot add yourself"
      }, 400)
    }

    try {
      const a = await createFriendRequest(
        result.currentUserNickname, result.requestedUserNickname
      )

      console.log(a)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }

    return ctx.json(200)
  }
)