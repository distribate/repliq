import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const createProfileViewSchema = z.object({
  initiator: z.string(),
  recipient: z.string(),
})

async function createProfileView({ initiator, recipient }: z.infer<typeof createProfileViewSchema>) {
  return await forumDB
  .insertInto('profile_views')
  .values({
    initiator,
    recipient
  })
  .returningAll()
  .executeTakeFirstOrThrow();
}

export const createProfileViewRoute = new Hono()
.post("/create-profile-view", zValidator("json", createProfileViewSchema), async (ctx) => {
  const body = await ctx.req.json();
  const result = createProfileViewSchema.parse(body);

  try {
    await createProfileView(result)
    return ctx.json({ status: "Profile viewed" }, 200)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 400)
  }
})