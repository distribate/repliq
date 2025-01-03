import { throwError } from "#helpers/throw-error.ts";
import { getFriendship } from "#lib/queries/get-friendship.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const getUserProfileStatusSchema = z.object({
  recipient: z.string(),
  initiator: z.string(),
})

async function getUserIsBanned(nickname: string) {
  const query = await forumDB
    .selectFrom("users_banned")
    .select(forumDB.fn.countAll().as('count'))
    .where('nickname', '=', nickname)
    .executeTakeFirst();

  if (!query) {
    return false
  }

  return Number(query.count) === 0 ? false : true
}

async function getUserIsViewed({
  initiator, recipient,
}: z.infer<typeof getUserProfileStatusSchema>) {
  const query = await forumDB
    .selectFrom("profile_views")
    .select(forumDB.fn.countAll().as('count'))
    .where("initiator", "=", initiator)
    .where("recipient", "=", recipient)
    .where("created_at", '>=', new Date(new Date().setDate(new Date().getDate() - 1)))
    .executeTakeFirst();

  if (!query) {
    return false
  }

  return Number(query.count) === 0 ? false : true
}

async function getUserIsPrivate({
  initiator, recipient,
}: z.infer<typeof getUserProfileStatusSchema>) {
  const query = await forumDB
    .selectFrom("users_settings")
    .select('profile_visibility')
    .where('nickname', '=', recipient)
    .executeTakeFirstOrThrow();

  if (initiator === recipient) return false;

  const friendShip = await getFriendship(initiator, recipient)

  if (friendShip) return false;

  return query.profile_visibility === 'all' ? false : true
}

async function getUserIsBlocked({
  initiator, recipient
}: z.infer<typeof getUserProfileStatusSchema>) {
  const query = await forumDB
    .selectFrom("users_blocked")
    .select(["initiator", "recipient"])
    .where((eb) => eb.or([
      eb('initiator', '=', initiator),
      eb('recipient', '=', initiator),
    ]))
    .where((eb) => eb.or([
      eb('initiator', '=', recipient),
      eb('recipient', '=', recipient),
    ]))
    .executeTakeFirst();

  if (!query) {
    return "none"
  }

  if (query.initiator === initiator) {
    return "blocked-by-you"
  }

  if (query.recipient === initiator) {
    return "blocked-by-user"
  }

  return "none"
}

export const getUserProfileStatusRoute = new Hono()
  .get("/get-user-profile-status", zValidator("query", getUserProfileStatusSchema), async (ctx) => {
    const query = ctx.req.query()
    const result = getUserProfileStatusSchema.parse(query)

    const { recipient } = result;
  
    const [isBanned, isViewed, isPrivate, isBlocked] = await Promise.all([
      getUserIsBanned(recipient),
      getUserIsViewed(result),
      getUserIsPrivate(result),
      getUserIsBlocked(result),
    ])

    try {
      const status = {
        is_banned: isBanned,
        is_private: isPrivate,
        is_blocked: isBlocked as "none" | "blocked-by-you" | "blocked-by-user",
        is_viewed: isViewed
      }

      return ctx.json(status, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }
  )