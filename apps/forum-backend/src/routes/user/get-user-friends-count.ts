import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { forumDB } from "#shared/database/forum-db.ts";
import { Hono } from "hono";

export async function getUserFriendsCount(nickname: string) {
  const query = await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("user_1", "=", nickname),
        eb("user_2", "=", nickname),
      ])
    )
    .$narrowType<{ count: number }>()
    .executeTakeFirst();

  return Number(query?.count) ?? 0
}

async function getUserRequestsCount(nickname: string) {
  const queryOutgoing = forumDB
    .selectFrom("friends_requests")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("initiator", "=", nickname),
      ])
    )
    .$narrowType<{ count: number }>()
    .executeTakeFirst()
    
  const queryIncoming = forumDB
    .selectFrom("friends_requests")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("recipient", "=", nickname),
      ])
    )
    .$narrowType<{ count: number }>()
    .executeTakeFirst()

  const [outgoing, incoming] = await Promise.all([queryOutgoing, queryIncoming])

  return {
    outgoing: Number(outgoing?.count) ?? 0,
    incoming: Number(incoming?.count) ?? 0,
  }
}

export const getUserFriendsCountRoute = new Hono()
  .get("/get-user-friends-count/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

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