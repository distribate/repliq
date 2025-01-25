import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserIsViewed } from "#lib/queries/user/get-user-is-viewed.ts";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const getUserProfileStatusSchema = z.object({
  recipient: z.string(),
})

export const getUserProfileStatusRoute = new Hono()
  .get("/get-user-profile-status", zValidator("query", getUserProfileStatusSchema), async (ctx) => {
    const query = ctx.req.query()
    const { recipient } = getUserProfileStatusSchema.parse(query)

    const initiator = getNickname()

    try {
      const [status, is_viewed] = await Promise.all([
        getUserRelation({ recipient, initiator }),
        getUserIsViewed({ recipient, initiator })
      ])

      return ctx.json({ data: { status, is_viewed } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }
)