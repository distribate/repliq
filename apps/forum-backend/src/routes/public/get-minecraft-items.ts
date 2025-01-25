import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getMinecraftItems() {
  return await forumDB
    .selectFrom("config_minecraft_items")
    .selectAll()
    .execute();
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