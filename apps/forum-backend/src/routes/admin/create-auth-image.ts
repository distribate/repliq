// import { createAuthImage } from "#lib/queries/admin/create-auth-image.ts";
// import { throwError } from "@repo/lib/helpers/throw-error";
// import { Hono } from "hono";

// export const createAuthImageRoute = new Hono()
//   .post("/create-auth-image", async (ctx) => {
//     const body = await ctx.req.parseBody();
//     // @ts-ignore
//     const files = body['files'] as File[];

//     try {
//        // @ts-ignore
//       const result = await createAuthImage(files);

//       return ctx.json({ status: "Uploaded" }, 200);
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 400);
//     }
//   })