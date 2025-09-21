import { getNickname } from "#lib/modules/context.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts";
import { validatePostOwner } from "#lib/validators/validate-post-owner.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

async function getPostViewers(
  id: string, 
  { cursor }: z.infer<typeof getPostViewersRouteSchema>
) {
  const query = forumDB
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

  const res = await executeWithCursorPagination(query, {
    after: cursor,
    perPage: 16,
    fields: [
      {
        expression: "created_at",
        key: "created_at",
        direction: "asc"
      }
    ],
    parseCursor: (cursor) => ({
      created_at: new Date(cursor.created_at)
    })
  })

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage ?? false,
      hasPrevPage: res.hasPrevPage ?? false,
      endCursor: res.endCursor,
      startCursor: res.startCursor,
    }
  };
}

const getPostViewersRouteSchema = z.object({
  cursor: z.string().optional()
})

export const getPostViewersRoute = new Hono()
  .get("/viewers/:id", zValidator("query", getPostViewersRouteSchema), async (ctx) => {
    const id = ctx.req.param("id");
    const nickname = getNickname()
    const result = getPostViewersRouteSchema.parse(ctx.req.query())

    const isValid = await validatePostOwner({ nickname, postId: id })

    if (!isValid) {
      return ctx.json({ error: "You are not the owner of this post" }, 400)
    }

    try {
      const viewers = await getPostViewers(id, result)

      return ctx.json({ data: viewers }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })