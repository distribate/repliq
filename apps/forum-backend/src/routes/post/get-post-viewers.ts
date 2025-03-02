import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts";
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts";

async function getPostViewers(id: string) {
  const query = await forumDB
    .selectFrom("posts_views")
    .innerJoin("users", "users.nickname", "posts_views.nickname")
    .select([
      "posts_views.created_at",
      "users.nickname",
      "users.name_color",
      "users.donate"
    ])
    .where("post_id", "=", id)
    .execute()

  return query;
}

export const getPostViewersRoute = new Hono()
  .get("/get-post-viewers/:id", async (ctx) => {
    const { id: postId } = ctx.req.param();
    const nickname = getNickname()

    const isValid = await validatePostOwner({ nickname, postId })

    if (!isValid) {
      return ctx.json({ error: "You are not the owner of this post" }, 400)
    }

    try {
      const viewers = await getPostViewers(postId)

      return ctx.json({ data: viewers }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })