import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import type { Posts } from "@repo/types/db/forum-database-types";
import { Hono } from "hono";
import type { Insertable } from "kysely";
import { z } from "zod";

type CreatePost = Omit<Insertable<Posts>, "isUpdated" | "created_at" | "id"> & {
  nickname: string
}

async function createPost({
  content, isComments, isPinned, visibility, nickname
}: CreatePost) {
  const query = await forumDB.transaction().execute(async (trx) => {
    const createPost = await trx
      .insertInto("posts")
      .values({ content, visibility, isComments, isPinned })
      .returningAll()
      .executeTakeFirstOrThrow()

    await trx
      .insertInto("posts_users")
      .values({ post_id: createPost.id, nickname })
      .returning("post_id")
      .executeTakeFirstOrThrow()

    return createPost;
  })

  return query;
}

const createPostSchema = z.object({
  content: z.string(),
  isComments: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  visibility: z.enum(["only", "all", "friends"]).optional(),
})

const DEFAULT_MAX_POSTS_PER_DAY = 50;
const DEFAULT_MAX_POSTS_PER_MINUTE = 2;

async function validatePostCooldown(nickname: string): Promise<"timeout" | null> {
  const now = new Date();

  const startOfDayUTC = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  );

  const oneMinuteAgoUTC = new Date(now.getTime() - 60 * 1000);

  const result = await forumDB
    .selectFrom("posts_users")
    .select([
      forumDB.fn
        .countAll()
        // @ts-ignore
        .filterWhere("created_at", ">", oneMinuteAgoUTC.toISOString())
        .as("postsPerMinute"),
      forumDB.fn
        .countAll()
        // @ts-ignore
        .filterWhere("created_at", ">", startOfDayUTC.toISOString())
        .as("postsPerDay"),
    ])
    .where("nickname", "=", nickname)
    .$narrowType<{ postsPerMinute: number; postsPerDay: number }>()
    .executeTakeFirstOrThrow();

  const { postsPerMinute, postsPerDay } = result

  if (postsPerMinute >= DEFAULT_MAX_POSTS_PER_MINUTE || postsPerDay >= DEFAULT_MAX_POSTS_PER_DAY) {
    return "timeout";
  }

  return null;
}

export const createPostRoute = new Hono()
  .post("/create-post", zValidator("json", createPostSchema), async (ctx) => {
    const nickname = getNickname()
    const { content, isComments, isPinned, visibility } = createPostSchema.parse(await ctx.req.json())

    try {
      const isValid = await validatePostCooldown(nickname)

      if (isValid === "timeout") {
        return ctx.json({ error: "Post timeout" }, 429)
      }

      const createdPost = await createPost({
        content, isComments, isPinned, visibility, nickname
      })

      if (!createdPost.id) {
        return ctx.json({ error: "Failed" }, 400)
      }

      return ctx.json({ data: createdPost, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })