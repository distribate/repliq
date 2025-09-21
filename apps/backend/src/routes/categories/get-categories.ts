import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "#utils/throw-error.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts"
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

type CategoryModel = {
  has_threads: boolean;
  title: string;
  id: number;
  threads_count: number;
  emoji: string;
  color: string;
  description: string | null;
};

const getCategoriesRouteSchema = z.object({
  type: z.enum(["available"]).optional()
})

type Opts = z.infer<typeof getCategoriesRouteSchema>

async function getCategories({
  type
}: Opts): Promise<CategoryModel[]> {
  let query = forumDB
    .selectFrom("category")
    .leftJoin("threads", "category.id", "threads.category_id")
    .select(eb => [
      "category.title",
      "category.color",
      "category.emoji",
      "category.description",
      eb.fn.sum<number>(
        eb.case()
          .when('threads.id', 'is not', null)
          .then(1)
          .else(0)
          .end()
      ).as('threads_count'),
      eb.cast<number>('category.id', 'int8').as('id')
    ])
    .orderBy("category.id", "asc")
    .groupBy([
      "category.id",
      "category.color",
      "category.emoji",
      "category.description",
      "category.title",
    ])

  switch (type) {
    case "available":
      query = query.where("available", "=", true)
      break;
  }

  const data = await query.execute()

  return data.map(category => ({
    ...category,
    has_threads: category.threads_count >= 1,
    emoji: getPublicUrl(STATIC_IMAGES_BUCKET, category.emoji)
  }))
}

export const getCategoriesRoute = new Hono()
  .get("/categories", zValidator("query", getCategoriesRouteSchema), async (ctx) => {
    const result = getCategoriesRouteSchema.parse(ctx.req.query());

    try {
      const data = await getCategories(result)

      ctx.header("Cache-Control", "public, max-age=60")

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })