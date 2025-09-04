import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import { forumDB } from "#shared/database/forum-db.ts";

import dayjs from "dayjs";

async function validateProfileViewCoolDown({
  initiator, recipient
}: InitiatorRecipientType): Promise<boolean> {
  const query = await forumDB
    .selectFrom('profile_views')
    .select(forumDB.fn.countAll().as('count'))
    .where('initiator', '=', initiator)
    .where('recipient', '=', recipient)
    .where("created_at", '>=', dayjs().subtract(1, 'day').toDate())
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  if (!query) {
    return false
  }

  return query.count === 0;
}

export const createProfileViewSchema = z.object({
  recipient: z.string(),
})

type CreateProfileView = z.infer<typeof createProfileViewSchema> & Pick<InitiatorRecipientType, "initiator">

async function createProfileView({ initiator, recipient }: CreateProfileView) {
  return forumDB
    .insertInto('profile_views')
    .values({ initiator, recipient })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export const createProfileViewRoute = new Hono()
  .post("/create-profile-view", zValidator("json", createProfileViewSchema), async (ctx) => {
    const initiator = getNickname()
    const { recipient } = createProfileViewSchema.parse(await ctx.req.json());

    const isValid = await validateProfileViewCoolDown({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "You cannot view the profile more than once per day" }, 400)
    }

    try {
      await createProfileView({ recipient, initiator })

      return ctx.json({ status: "Viewed" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })