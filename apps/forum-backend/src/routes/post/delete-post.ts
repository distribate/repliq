import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod/v4";

const deletePostSchema = z.object({
  id: z.string()
})

type DeletePost = {
  postId: string
  nickname: string
}

async function deletePost({ postId, nickname }: DeletePost) {
  const query = await forumDB.transaction().execute(async (trx) => {
    const postUser = await trx
      .deleteFrom("posts_users")
      .where("post_id", "=", postId)
      .where("nickname", "=", nickname)
      .executeTakeFirstOrThrow()

    if (!postUser.numDeletedRows) return;

    const postItem = await trx
      .deleteFrom("posts")
      .where("id", "=", postId)
      .executeTakeFirstOrThrow()

    return postItem;
  })

  return query;
}

export const deletePostRoute = new Hono()
  .delete("/delete-post", zValidator("json", deletePostSchema), async (ctx) => {
    const nickname = getNickname()
    const { id: postId } = deletePostSchema.parse(await ctx.req.json())

    try {
      const isValid = await validatePostOwner({ nickname, postId })

      if (!isValid) {
        return ctx.json({ error: "You are not the owner of this post" }, 400)
      }

      const deleted = await deletePost({ nickname, postId })

      if (!deleted || !deleted.numDeletedRows) {
        return ctx.json({ error: "Failed" }, 404)
      }

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })