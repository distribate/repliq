import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts";
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts";

async function getPostViewers(id: string) {
  const query = await forumDB
    .selectFrom("posts_views")
    .innerJoin("users", "users.nickname", "posts_views.nickname")
    .leftJoin("users_subs", "users.nickname", "users_subs.nickname")
    .select(eb => [
      "posts_views.created_at",
      "users.nickname",
      "users.name_color",
      "users.avatar",
      eb.case()
        .when('users_subs.id', 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('is_donate'),
    ])
    .limit(16)
    .where("post_id", "=", id)
    .orderBy("posts_views.created_at", "desc")
    .execute()

  return {
    data: query,
    meta: {
      count: query.length
    }
  };
}

export const getPostViewersRoute = new Hono()
  .get("/get-post-viewers/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const nickname = getNickname()

    const isValid = await validatePostOwner({ nickname, postId: id })

    if (!isValid) {
      return ctx.json({ error: "You are not the owner of this post" }, 400)
    }

    try {
      const viewers = await getPostViewers(id)

      return ctx.json({ data: viewers }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })