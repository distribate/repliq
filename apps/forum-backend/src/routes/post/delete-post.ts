import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

export async function validatePostOwner(nickname: string, postId: string): Promise<boolean> {
  const q = await forumDB
    .selectFrom("posts_users")
    .select(forumDB.fn.countAll().as("count"))
    .$castTo<{ count: number }>()
    .where("nickname", "=", nickname)
    .where("post_id", "=", postId)
    .executeTakeFirstOrThrow()

  return q.count > 0
}

const deletePostSchema = z.object({
  id: z.string()
})

async function deletePost(postId: string, nickname: string) {
  return await forumDB.transaction().execute(async (trx) => {
    await trx
      .deleteFrom("posts_users")
      .where("post_id", "=", postId)
      .where("nickname", "=", nickname)
      .executeTakeFirstOrThrow()

    return await trx
      .deleteFrom("posts")
      .where("id", "=", postId)
      .executeTakeFirstOrThrow()
  })
}

export const deletePostRoute = new Hono()
  .delete("/delete-post", zValidator("json", deletePostSchema), async (ctx) => {
    const nickname = getNickname()
    const { id } = deletePostSchema.parse(await ctx.req.json())

    try {
      const isValid = await validatePostOwner(nickname, id)

      if (!isValid) {
        return ctx.json({ error: "You are not the owner of this post" }, 400)
      }

      const del = await deletePost(id, nickname)

      if (!del.numDeletedRows) {
        return ctx.json({ error: "Failed" }, 404)
      }

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })