import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { sql } from "kysely";

async function getMinecraftItems() {
  const q = await forumDB
    .selectFrom("config_minecraft_items")
    .select([
      "description",
      "title",
      "image",
      sql`CAST(id AS INT)`.as("id"),
    ])
    .$castTo<{ id: number, title: string, image: string, description: string | null }>()    
    .execute();

  return await Promise.all(q.map(async (item) => ({
    ...item,
    image: (await getPublicUrl("static", item.image)).data.publicUrl
  })))
}

export const getMinecraftItemsRoute = new Hono()
  .get("/get-minecraft-items", async (ctx) => {
    try {
      const items = await getMinecraftItems();

      return ctx.json({ data: items }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })