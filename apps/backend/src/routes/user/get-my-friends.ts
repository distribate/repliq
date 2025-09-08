import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "#utils/throw-error.ts";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { Hono } from "hono";
import { getUserFriendsCount } from "./get-user-friends";
import { getMyFriends } from "#lib/queries/user/get-my-friends.ts";

async function getUserRequestsCount(nickname: string) {
  const queryOutgoing = forumDB
    .selectFrom("friends_requests")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("initiator", "=", nickname),
      ])
    )

  const queryIncoming = forumDB
    .selectFrom("friends_requests")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("recipient", "=", nickname),
      ])
    )

  const [outgoing, incoming] = await Promise.all([
    queryOutgoing.executeTakeFirst(),
    queryIncoming.executeTakeFirst()
  ])

  return {
    outgoing: Number(outgoing?.count || 0),
    incoming: Number(incoming?.count || 0),
  }
}

export const getMyFriendsRoute = new Hono()
  .get("/my-friends", async (ctx) => {
    const nickname = getNickname()
    const result = getUserFriendsSchema.parse(ctx.req.query());

    try {
      const data = await getMyFriends(nickname, result)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })

export const getMyFriendsMetaRoute = new Hono()
  .get("/my-friends-meta", async (ctx) => {
    const nickname = getNickname()

    try {
      const [requestsCount, friendsCount] = await Promise.all([
        getUserRequestsCount(nickname),
        getUserFriendsCount(nickname),
      ])

      return ctx.json({ data: { friendsCount, requestsCount } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })