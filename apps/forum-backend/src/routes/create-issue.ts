import { throwError } from "#helpers/throw-error.ts";
import { publishIssuePayload } from "#publishers/pub-issue-payload.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().max(256),
  description: z.string().max(2048),
  nickname: z.string().min(1),
  type: z.enum(["bug", "suggestion", "game"])
})

async function createIssue({
  title, description, nickname: user_nickname, type
}: z.infer<typeof createIssueSchema>) {
  return await forumDB
    .insertInto("issues")
    .values({
      title,
      description,
      user_nickname,
      type
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export const createIssueRoute = new Hono()
  .post("/create-issue", zValidator("json", createIssueSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = createIssueSchema.parse(body)

    try {
      const createdIssue = await createIssue(result)
      await publishIssuePayload(createdIssue)
      return ctx.json({ status: "Issue created" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }
)