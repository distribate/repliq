import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod/v4";

const createBanSchema = z.object({
  recipient: z.string(),
  time: z.string(),
  reason: z.string()
})

type CreateBan = z.infer<typeof createBanSchema> & Omit<InitiatorRecipientType, "recipient">

async function createBan({
  initiator, reason, recipient, time
}: CreateBan) {
  const query = await forumDB
    .insertInto("users_banned")
    .values({ nickname: recipient, time, reason })
    .returning("id")
    .executeTakeFirstOrThrow()

  return query;
}

export const createBanRoute = new Hono()
  .post("/create-ban", zValidator("json", createBanSchema), async (ctx) => {
    const initiator = getNickname()

    const result = createBanSchema.parse(await ctx.req.json())

    try {
      const created = await createBan({ ...result, initiator })

      if (!created.id) {
        return ctx.json({ error: "Invalid created ban" }, 500)
      }

      return ctx.json({ data: created.id }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })