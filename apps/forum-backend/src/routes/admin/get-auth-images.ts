// import { getAuthImages } from "#lib/queries/admin/get-auth-images.ts";
// import { throwError } from "@repo/lib/helpers/throw-error";
// import { Hono } from "hono";

// export const getAuthImagesRoute = new Hono()
//   .get("/get-auth-images", async (ctx) => {

//     try {
//       const images = await getAuthImages();

//       return ctx.json({ data: images }, 200);
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 500);
//     }
//   })