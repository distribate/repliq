import { forumDB } from "#shared/database/forum-db.ts";
import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono";

async function getFavoriteItem(nickname: string) {
  const favoriteId = await forumDB
    .selectFrom("users")
    .select("favorite_item")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  const query = await sqliteDB
    .selectFrom("minecraft_items")
    .select([
      "image",
      "id",
      "title",
      "description"
    ])
    .where("id", "=", Number(favoriteId))
    .executeTakeFirst();

  return query;
}

export const getUserFavoriteItemRoute = new Hono()
  .get("/get-user-favorite-item/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const favoriteItem = await getFavoriteItem(nickname)

      if (!favoriteItem) {
        return ctx.json({ data: null }, 200)
      }

      let favoriteItemImage = getPublicUrl(STATIC_IMAGES_BUCKET, favoriteItem.image)

      return ctx.json({ data: { ...favoriteItem, image: favoriteItemImage } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })