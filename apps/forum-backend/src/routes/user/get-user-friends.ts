import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserFriends } from "#lib/queries/user/get-user-friends.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Encoder } from "cbor-x";
import { userPreferenceAndPrivateValidation } from "#utils/validate-user-preference-private.ts";
import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserFriendsCount(nickname: string): Promise<number> {
  const query = await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("user_1", "=", nickname),
        eb("user_2", "=", nickname),
      ])
    )
    .executeTakeFirst();

  if (!query) return 0;

  return Number(query.count) ?? 0
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
    outgoing: Number(outgoing?.count) ?? 0,
    incoming: Number(incoming?.count) ?? 0,
  }
}

const encoder = new Encoder({ 
  useRecords: false, structures: [], pack: true 
});

export const getUserFriendsMetaRoute = new Hono()
  .get("/get-friends-meta", async (ctx) => {
    const initiator = getNickname()

    try {
      const [requestsCount, friendsCount] = await Promise.all([
        getUserRequestsCount(initiator),
        getUserFriendsCount(initiator),
      ])

      return ctx.json({ data: { friendsCount, requestsCount } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })

export const getUserFriendsRoute = new Hono()
  .get("/get-friends/:nickname", zValidator("query", getUserFriendsSchema), async (ctx) => {
    const { nickname: recipient } = ctx.req.param()
    const initiator = getNickname()
    const result = getUserFriendsSchema.parse(ctx.req.query());

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const friends = await getUserFriends({ nickname: recipient, ...result })

      const encodedFriends = encoder.encode(friends)

      return ctx.body(
        encodedFriends as unknown as ReadableStream,
        200,
        { 'Content-Type': 'application/cbor' }
      )
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })