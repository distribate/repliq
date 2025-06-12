// import { forumDB } from "#shared/database/forum-db.ts";
// import { supabase } from "#shared/supabase/supabase-client.ts";
// import { throwError } from "@repo/lib/helpers/throw-error";
// import { decode } from "cbor-x";
// import { Hono } from "hono";
// import { z } from "zod/v4";
// import { nanoid } from "nanoid";
// import { createNewsSchema } from "@repo/types/schemas/admin/create-news-schema";
// import { zValidator } from "@hono/zod-validator";
// import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";

// type CreateNews = Omit<z.infer<typeof createNewsSchema>, "image"> & {
//   image: File | null;
// };

// async function createNews(data: CreateNews) {
//   return await forumDB.transaction().execute(async (trx) => {
//     let imageUrl: string | null = null

//     if (data?.image) {
//       const imageMimeType = data.image.type ?? "image/png"
//       const imageMimeTypeSplitted = imageMimeType.split("/")[1]

//       const imageName = `news/${data.image.name}.${imageMimeTypeSplitted}`

//       const uploaded = await supabase.storage
//         .from(STATIC_IMAGES_BUCKET)
//         .upload(imageName, data.image, { contentType: imageMimeType })

//       if (uploaded.error) {
//         throw new Error(uploaded.error.message)
//       }

//       imageUrl = imageName
//     }

//     return await trx
//       .insertInto("news")
//       .values({
//         description: data.description,
//         title: data.title,
//         imageUrl: imageUrl ?? undefined,
//         media_links: data.media_links,
//         tags: data.tags,
//       })
//       .returning("id")
//       .executeTakeFirst()
//   })
// }

// async function deleteNews(id: string) {
//   return await forumDB.transaction().execute(async (trx) => {
//     const newsImage = await trx
//       .selectFrom("news")
//       .selectAll()
//       .where("id", "=", id)
//       .executeTakeFirst()

//     if (newsImage) {
//       await supabase
//         .storage
//         .from(STATIC_IMAGES_BUCKET)
//         .remove([newsImage.imageUrl])
//     }

//     return await trx
//       .deleteFrom("news")
//       .where("id", "=", id)
//       .executeTakeFirst()
//   })
// }

// export const deleteNewsRoute = new Hono()
//   .delete("/delete-news/:id", async (ctx) => {
//     const { id } = ctx.req.param()

//     try {
//       const removedNews = await deleteNews(id!)

//       if (!removedNews.numDeletedRows) {
//         return ctx.json({ error: "News not found" }, 404)
//       }

//       return ctx.json({ status: "Success" }, 200)
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 500)
//     }
//   })

// export const createNewsRoute = new Hono()
//   .post("/create-news", async (ctx) => {
//     const binaryData = new Uint8Array(await ctx.req.arrayBuffer());

//     let decodedData: z.infer<typeof createNewsSchema>;

//     try {
//       decodedData = decode(binaryData);
//     } catch (e) {
//       return ctx.json({ error: "Invalid data structure" }, 400);
//     }

//     const result = createNewsSchema.safeParse(decodedData);

//     if (!result.success) {
//       return ctx.json({ error: result.error.message }, 400)
//     }

//     const { image: raw } = result.data

//     const newsId = nanoid(4)

//     let image = raw ? new File([raw], newsId, { type: "image/png" }) : null

//     try {
//       const news = await createNews({
//         ...result.data,
//         image: image as File | null
//       });

//       if (!news || !news.id) {
//         return ctx.json({ error: "Failed to create news" }, 500)
//       }

//       return ctx.json({ data: news.id }, 200)
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 500);
//     }
//   })