import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { createProfileView } from "#lib/queries/user/create-profile-view.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod/v4";
import { validateProfileViewCoolDown } from '#lib/queries/user/validate-profile-view-cooldown.ts';

export const createProfileViewSchema = z.object({
  recipient: z.string(),
})

export const createProfileViewRoute = new Hono()
  .post("/create-profile-view", zValidator("json", createProfileViewSchema), async (ctx) => {
    const result = createProfileViewSchema.parse(await ctx.req.json());

    const initiator = getNickname()
    const { recipient } = result;

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