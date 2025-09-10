import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#lib/modules/context.ts";
import { validatePostsTimeout } from "#lib/validators/validate-posts-timeout.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import type { Posts } from "@repo/types/db/forum-database-types";
import { Hono } from "hono";
import type { Insertable } from "kysely";
import * as z from "zod";

type CreatePost = Omit<Insertable<Posts>, "isUpdated" | "created_at" | "id"> & {
  nickname: string
}

async function createPost({
  content, isComments, isPinned, visibility, nickname
}: CreatePost) {
  return forumDB.transaction().execute(async (trx) => {
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
}

const createPostSchema = z.object({
  content: z.string(),
  isComments: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  visibility: z.enum(["only", "all", "friends"]).optional(),
})

export const createPostRoute = new Hono()
  .post("/create", zValidator("json", createPostSchema), async (ctx) => {
    const nickname = getNickname()
    const { content, isComments, isPinned, visibility } = createPostSchema.parse(await ctx.req.json())

    try {
      const isValid = await validatePostsTimeout(nickname)

      if (isValid === "timeout") {
        return ctx.json({ error: "Post timeout" }, 429)
      }

      const createdPost = await createPost({
        content, isComments, isPinned, visibility, nickname
      })

      if (!createdPost.id) {
        return ctx.json({ error: "Failed" }, 400)
      }

      const data = {
        data: createdPost, 
        status: "Success"
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })