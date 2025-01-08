import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { decode, encode } from 'cbor-x';

const cborRenderer = createMiddleware(async (ctx, next) => {
  ctx.header('Content-Type', 'application/cbor')

  ctx.setRenderer((content) => {
    return ctx.body(decode(content))
  })

  await next()
})

export const encodeCborXRoute = new Hono()
  .use(cborRenderer)
  .post("/encode-cbor-x", async (ctx) => {
    const responseData = ctx.render({})

  })