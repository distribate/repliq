import { throwError } from "#utils/throw-error.ts"
import { Hono } from "hono"
import * as z from "zod"
import dayjs from "@repo/shared/constants/dayjs-instance"
import { forumDB } from "#shared/database/forum-db.ts"
import { getNickname } from "#lib/modules/context.ts"

const createUserRestrictSchema = z.object({
  type: z.enum(["posts", "threads"]),
  time: z.string(),
  recipient: z.string()
})

type CreateUserRestrict = z.infer<typeof createUserRestrictSchema> & Omit<InitiatorRecipientType, "recipient">

async function createUserRestrict({
  initiator, recipient, time, type
}: CreateUserRestrict) {
  const formattedTime: Date = dayjs(time).toDate()

  if (type === 'posts') {
    const query = await forumDB
      .insertInto("users_punish")
      .values({
        initiator, nickname: recipient, type
      })
      .returning("id")
      .executeTakeFirstOrThrow()

    return query;
  }

  if (type === 'threads') {

  }

  throw new Error("Error restrict type")
}

export const createUserRestrictRoute = new Hono()
  .post("/create-user-restrict", async (ctx) => {
    const initiator = getNickname()
    const result = createUserRestrictSchema.parse(await ctx.req.json())

    try {
      const created = await createUserRestrict({ ...result, initiator })

      if (!created.id) {
        return ctx.json({ error: "Invalid create a restrict" }, 500)
      }

      return ctx.json({ data: created.id }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })