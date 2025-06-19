// import { sqliteDB } from "#shared/database/sqlite-db.ts";
// import { getPublicUrl } from "#utils/get-public-url.ts";
// import { throwError } from "@repo/lib/helpers/throw-error";
// import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
// import { Hono } from "hono";
// import { sql } from "kysely";

// async function getMinecraftItems() {
//   const query = await sqliteDB
//     .selectFrom("minecraft_items")
//     .select([
//       "description",
//       "title",
//       "image",
//       sql`CAST(id AS INT)`.as("id"),
//     ])
//     .$castTo<{ id: number, title: string, image: string, description: string | null }>()    
//     .execute();

//   return await Promise.all(query.map(async (item) => ({
//     ...item,
//     image: getPublicUrl(STATIC_IMAGES_BUCKET, item.image)
//   })))
// }

// export const getMinecraftItemsRoute = new Hono()
//   .get("/get-minecraft-items", async (ctx) => {
//     try {
//       const items = await getMinecraftItems();

//       return ctx.json({ data: items }, 200);
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 500);
//     }
//   })