// import { throwError } from "@repo/lib/helpers/throw-error";
// import { Hono } from "hono";
// import { createMinecraftItem } from "#lib/queries/admin/create-minecraft-item.ts";
// import type { z } from "zod/v4";
// import { createMinecraftItemSchema } from "@repo/types/schemas/admin/create-minecraft-item-schema";

// export const createMinecraftItemRoute = new Hono()
//   .post("/create-minecraft-item", async (ctx) => {
//     const body = await ctx.req.parseBody();
//     const file = body['file'] as File;
//     const meta = body['meta'] as string

//     const pMeta = JSON.parse(meta)

//     try {
//       const res = await createMinecraftItem({ file, meta: pMeta as z.infer<typeof createMinecraftItemSchema>["meta"] });

//       return ctx.json({ status: "Minecraft item created" }, 200);
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 400);
//     }
//   })