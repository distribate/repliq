import { throwError } from "#helpers/throw-error.ts";
import { createProfileView } from "#lib/queries/user/create-profile-view.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const createProfileViewSchema = z.object({
  recipient: z.string(),
})

export const createProfileViewRoute = new Hono()
  .post("/create-profile-view", zValidator("json", createProfileViewSchema), async (ctx) => {
    const body = await ctx.req.json();
    const result = createProfileViewSchema.parse(body);

    const initiator = getNickname()

    try {
      await createProfileView({ ...result, initiator })
      return ctx.json({ status: "Profile viewed" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })