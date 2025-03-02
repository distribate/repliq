import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getFavoriteItem(nickname: string) {
  const query = await forumDB
    .selectFrom("config_minecraft_items")
    .innerJoin("users", "users.favorite_item", "config_minecraft_items.id")
    .select([
      "config_minecraft_items.image",
      "config_minecraft_items.id",
      "config_minecraft_items.title",
      "config_minecraft_items.description"
    ])
    .where("users.nickname", "=", nickname)
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

      let favoriteItemImage = getPublicUrl("static", favoriteItem.image)

      return ctx.json({ data: { ...favoriteItem, image: favoriteItemImage } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })