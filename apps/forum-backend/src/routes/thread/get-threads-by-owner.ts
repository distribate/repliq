import { getFriendship } from "#lib/queries/friend/get-friendship.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { sql } from "kysely";
import { executeWithCursorPagination } from "kysely-paginate";
import { z } from "zod/v4";

const getThreadsByOwnerSchema = z.object({
  exclude: z.string(),
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional(),
})

type GetThreadsByOwnerParams = z.infer<typeof getThreadsByOwnerSchema> & {
  nickname: string,
  initiator: string
}

export async function getRandomThreads(exclude: string) {
  const query = await forumDB
    .selectFrom("threads_users")
    .innerJoin("threads", "threads_users.thread_id", "threads.id")
    .innerJoin("threads_images", "threads.id", "threads_images.thread_id")
    .select([
      "threads.id",
      "threads.title",
      "threads.description",
      "threads.created_at",
      "threads.visibility",
      "threads_images.image_url"
    ])
    .groupBy([
      "threads.id",
      "threads.title",
      "threads.description",
      "threads.created_at",
      "threads.visibility",
      "threads_images.image_url"
    ])
    .orderBy(sql`random()`)
    .limit(15)
    .execute()

  if (!query) return null;

  return query.filter(i => i.id !== exclude)
}

async function getThreadsByOwner({
  exclude, cursor, limit, nickname, initiator
}: GetThreadsByOwnerParams) {
  let recipient: string = nickname;

  const isFriend = await getFriendship({ initiator, recipient })

  const query = forumDB
    .selectFrom("threads_users")
    .innerJoin("threads", "threads_users.thread_id", "threads.id")
    .innerJoin("threads_images", "threads.id", "threads_images.thread_id")
    .select([
      "threads.id",
      "threads.title",
      "threads.description",
      "threads.created_at",
      "threads.visibility",
      "threads_images.image_url"
    ])
    .groupBy([
      "threads.id",
      "threads.title",
      "threads.description",
      "threads.created_at",
      "threads.visibility",
      "threads_images.image_url"
    ])

  // threads by owner
  let ownerRes = await executeWithCursorPagination(
    query.where("threads_users.user_nickname", "=", recipient),
    {
      after: cursor,
      perPage: limit ?? 12,
      fields: [
        { key: "created_at", direction: "asc", expression: "threads.created_at" }
      ],
      parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) })
    })

  ownerRes.rows = ownerRes.rows.filter(t => t.id !== exclude)

  if (!ownerRes.rows || !ownerRes.rows.length) {
    const randomFriend = await forumDB
      .selectFrom("users_friends")
      .select("user_2")
      .where("user_1", "=", nickname)
      .executeTakeFirst();

    if (randomFriend && randomFriend.user_2) {
      // threads by owner's friend

      recipient = randomFriend.user_2;

      let friendRes = await executeWithCursorPagination(
        query.where("threads_users.user_nickname", "=", recipient),
        {
          after: cursor,
          perPage: limit ?? 12,
          fields: [
            { key: "created_at", direction: "asc", expression: "threads.created_at" }
          ],
          parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) })
        })

      friendRes.rows = friendRes.rows
        .filter(thread => thread.visibility === "all" || (thread.visibility === "friends" && isFriend))
        .filter(thread => thread.id !== exclude)

      return {
        data: friendRes.rows,
        meta: {
          hasNextPage: friendRes.hasNextPage,
          hasPrevPage: friendRes.hasPrevPage,
          startCursor: friendRes.startCursor,
          endCursor: friendRes.endCursor
        }
      }
    }
  } else {
    ownerRes.rows = ownerRes.rows
      .filter(thread => thread.visibility === "all" || (thread.visibility === "friends" && isFriend))

    return {
      data: ownerRes.rows,
      meta: {
        hasNextPage: ownerRes.hasNextPage,
        hasPrevPage: ownerRes.hasPrevPage,
        startCursor: ownerRes.startCursor,
        endCursor: ownerRes.endCursor
      }
    }
  }

  // other threads
  const excludedCategory = await forumDB
    .selectFrom("category")
    .innerJoin("threads", "category.id", "threads.category_id")
    .select("category.id")
    .where("threads.id", "=", exclude)
    .executeTakeFirstOrThrow();

  let otherRes = await executeWithCursorPagination(
    query
      .where("threads_users.user_nickname", "!=", recipient)
      .where("threads.id", "!=", exclude),
    {
      after: cursor,
      perPage: limit ?? 12,
      fields: [
        { key: "created_at", direction: "asc", expression: "threads.created_at" }
      ],
      parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) })
    })

  otherRes.rows = otherRes.rows
    .filter(thread => thread.visibility === "all" || (thread.visibility === "friends" && isFriend))

  return {
    data: otherRes.rows,
    meta: {
      hasNextPage: otherRes.hasNextPage,
      hasPrevPage: otherRes.hasPrevPage,
      startCursor: otherRes.startCursor,
      endCursor: otherRes.endCursor
    }
  }
}

export const getThreadsByOwnerRoute = new Hono()
  .get("/get-threads-by-owner/:nickname", zValidator("query", getThreadsByOwnerSchema), async (ctx) => {
    const { nickname: recipient } = ctx.req.param();
    const { exclude, limit, cursor } = getThreadsByOwnerSchema.parse(ctx.req.query());

    const initiator = getNickname(true)

    if (!initiator) {
      const threads = await getRandomThreads(exclude)

      return ctx.json({ data: threads, meta: null }, 200)
    }

    try {
      const threads = await getThreadsByOwner({
        exclude, cursor, limit, nickname: recipient, initiator
      });

      return ctx.json(threads, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })