import { getFriendship } from "#lib/queries/friend/get-friendship.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sql } from "kysely";
import { executeWithCursorPagination } from "kysely-paginate";
import * as z from "zod";

const getThreadsByOwnerSchema = z.object({
  exclude: z.string(),
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional(),
})

type GetThreadsByOwnerParams = z.infer<typeof getThreadsByOwnerSchema> & {
  nickname: string,
  initiator: string
}

type RecommendedThreads = {
  id: string;
  created_at: Date;
  title: string;
  description: string | null;
  image_url: string;
  visibility: "all" | "friends" | "only",
  owner: {
    nickname: string,
    name_color: string,
    avatar: string | null
  }
}

type Rec = {
  data: RecommendedThreads[],
  meta: {
    hasNextPage: boolean | undefined;
    hasPrevPage: boolean | undefined;
    startCursor: string | undefined;
    endCursor: string | undefined;
  };
}

const query = (exclude: string) => forumDB
  .selectFrom("threads_users")
  .innerJoin("threads", "threads_users.thread_id", "threads.id")
  .innerJoin("users", "threads_users.nickname", "users.nickname")
  .innerJoin("threads_images", "threads.id", "threads_images.thread_id")
  .select([
    "threads.id",
    "threads.title",
    "threads.description",
    "threads.created_at",
    "threads.visibility",
    "threads_images.image_url",
    "users.nickname",
    "users.name_color",
    "users.avatar",
  ])
  .groupBy([
    "threads.id",
    "threads.title",
    "threads.description",
    "threads.created_at",
    "threads.visibility",
    "threads_images.image_url",
    "users.nickname",
    "users.name_color",
    "users.avatar",
  ])
  .where("threads.id", "!=", exclude)

export async function getRandomThreads(exclude: string): Promise<RecommendedThreads[]> {
  const randomThreadsQuery = await query(exclude)
    .orderBy(sql`random()`)
    .limit(12)
    .execute()

  if (!randomThreadsQuery) return []

  const newData = randomThreadsQuery.map(t => ({
    id: t.id,
    title: t.title,
    created_at: t.created_at,
    description: t.description,
    visibility: t.visibility ?? "all",
    image_url: getPublicUrl("threads", t.image_url),
    owner: {
      nickname: t.nickname,
      name_color: t.name_color,
      avatar: t.avatar
    }
  }))

  return newData
}

async function getThreadsByOwner({
  exclude, cursor, limit = 12, nickname, initiator
}: GetThreadsByOwnerParams): Promise<Rec> {
  let recipient: string = nickname;

  const isFriend = await getFriendship({ initiator, recipient })

  // threads by owner
  const ownerResQuery = query(exclude)
    .where("threads_users.nickname", "=", recipient);

  const ownerRes = await executeWithCursorPagination(
    ownerResQuery,
    {
      after: cursor,
      perPage: limit,
      fields: [
        { key: "created_at", direction: "asc", expression: "threads.created_at" }
      ],
      parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) })
    }
  )

  if (!ownerRes.rows || !ownerRes.rows.length) {
    const randomFriend = await forumDB
      .selectFrom("users_friends")
      .select("user_2")
      .where("user_1", "=", nickname)
      .executeTakeFirst();

    if (randomFriend && randomFriend.user_2) {
      // threads by owner's friend

      recipient = randomFriend.user_2;

      const friendResQuery = query(exclude).where("threads_users.nickname", "=", recipient)

      let friendRes = await executeWithCursorPagination(
        friendResQuery,
        {
          after: cursor,
          perPage: limit,
          fields: [
            { key: "created_at", direction: "asc", expression: "threads.created_at" }
          ],
          parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) })
        }
      )

      friendRes.rows = friendRes.rows
        .filter(thread => thread.visibility === "all" || (thread.visibility === "friends" && isFriend))

      const newData = friendRes.rows.map(t => ({
        id: t.id,
        title: t.title,
        created_at: t.created_at,
        description: t.description,
        visibility: t.visibility ?? "all",
        image_url: getPublicUrl("threads", t.image_url),
        owner: {
          nickname: t.nickname,
          avatar: t.avatar,
          name_color: t.name_color
        }
      }))

      return {
        data: newData,
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

    const newData = ownerRes.rows.map(t => ({
      id: t.id,
      title: t.title,
      created_at: t.created_at,
      description: t.description,
      visibility: t.visibility ?? "all",
      image_url: getPublicUrl("threads", t.image_url),
      owner: {
        nickname: t.nickname,
        avatar: t.avatar,
        name_color: t.name_color
      }
    }))

    return {
      data: newData,
      meta: {
        hasNextPage: ownerRes.hasNextPage,
        hasPrevPage: ownerRes.hasPrevPage,
        startCursor: ownerRes.startCursor,
        endCursor: ownerRes.endCursor
      }
    }
  }

  const otherResQuery = query(exclude)
    .where("threads_users.nickname", "!=", recipient)

  let otherRes = await executeWithCursorPagination(
    otherResQuery,
    {
      after: cursor,
      perPage: limit,
      fields: [
        { key: "created_at", direction: "asc", expression: "threads.created_at" }
      ],
      parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) })
    }
  )

  otherRes.rows = otherRes.rows
    .filter(thread => thread.visibility === "all" || (thread.visibility === "friends" && isFriend))

  const newData = otherRes.rows.map(t => ({
    id: t.id,
    title: t.title,
    created_at: t.created_at,
    description: t.description,
    visibility: t.visibility ?? "all",
    image_url: getPublicUrl("threads", t.image_url),
    owner: {
      nickname: t.nickname,
      avatar: t.avatar,
      name_color: t.name_color
    }
  }))

  return {
    data: newData,
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
    const recipient = ctx.req.param("nickname");
    const { exclude, limit, cursor } = getThreadsByOwnerSchema.parse(ctx.req.query());

    const initiator = getNickname(true)

    if (!initiator) {
      const threads = await getRandomThreads(exclude)

      return ctx.json({ data: threads, meta: null }, 200)
    }

    try {
      const threads = await getThreadsByOwner({ exclude, cursor, limit, nickname: recipient, initiator });

      return ctx.json<Rec>(threads, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })