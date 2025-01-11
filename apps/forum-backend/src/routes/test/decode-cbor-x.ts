import { Hono } from "hono";
import { decode, encode } from 'cbor-x';
import { createMiddleware } from "hono/factory";


const cborRenderer = createMiddleware(async (ctx, next) => {
  ctx.header('Content-Type', 'application/cbor')

  await next()
})

export const decodeCborXRoute = new Hono()
  .use(cborRenderer)
  .post("/decode-cbor", async (ctx) => {
    try {
      const binaryData = new Uint8Array(await ctx.req.arrayBuffer());
      console.log('Received binary data size:', binaryData.byteLength);

      const decodedData = decode(binaryData);
      console.log('Decoded Data:', decodedData);

      const {
        category_id,
        title,
        visibility,
        content,
        description,
        tags,
        permission,
        is_comments,
        images
      } = decodedData;


      return ctx.json({ success: true, message: "File uploaded successfully!" });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 500);
      }
    }
  })