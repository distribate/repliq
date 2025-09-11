import * as  z from "zod";
import dayjs from "@repo/shared/constants/dayjs-instance"
import { SERVER_TOKEN, SERVICE_CHAT_ID } from "#shared/env/index.ts";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { format } from "gramio";
import { servicedBot } from "#shared/bots/init.ts";

const notifySchema = z.object({
  created_at: z.string().or(z.date()),
  type: z.enum(["on-preview"]),
  data: z.unknown().nullable()
})

export const notifyRoute = new Hono()
  .basePath("/notify")
  .use(async (ctx, next) => {
    const token = ctx.req.header("TOKEN");

    if (!token || token !== SERVER_TOKEN) {
      throw new Error("Token invalid")
    }

    await next()
  })
  .post("/", zValidator("json", notifySchema), async (ctx) => {
    const payload = notifySchema.parse(await ctx.req.json())

    const text = format`
    ${dayjs(payload.created_at).format("HH:ss DD MMM YY")} -> ${payload.type}. 
    Data: ${JSON.stringify(payload.data)}
    `;

    await servicedBot.api.sendMessage({ chat_id: SERVICE_CHAT_ID, text });

    return ctx.body(null, 200)
  })