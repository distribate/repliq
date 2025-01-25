import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { callServerCommandSchema } from '@repo/types/schemas/server/server-command.ts';
import { publishServerCommand } from '#publishers/pub-server-command.ts';

export const callServerCommandRoute = new Hono()
  .post("/call-server-command", zValidator("json", callServerCommandSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = callServerCommandSchema.parse(body)

    try {
      publishServerCommand(result);

      return ctx.json({ status: "Published" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })