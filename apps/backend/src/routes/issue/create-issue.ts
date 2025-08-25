import { throwError } from '#utils/throw-error.ts';
import { publishIssuePayload } from "#publishers/pub-issue-payload.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import * as z from "zod"

type CreateIssue = z.infer<typeof createIssueSchema> & {
  nickname: string
}

async function createIssue({
  title, description, nickname, type
}: CreateIssue) {
  return forumDB
    .insertInto("issues")
    // @ts-expect-error
    .values({
      title,
      description,
      nickname,
      type
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export const createIssueRoute = new Hono()
  .post("/create-issue", zValidator("json", createIssueSchema), async (ctx) => {
    const result = createIssueSchema.parse(await ctx.req.json())
    const nickname = getNickname()

    try {
      const createdIssue = await createIssue({ ...result, nickname })

      if (!createdIssue) {
        return ctx.json({ error: "Error creating issue" }, 400);
      }

      publishIssuePayload({ title: createdIssue.title, nickname })

      return ctx.json({ status: "Issue created" }, 200)
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "daily_limit") {
          return ctx.json({ error: "daily_limit" }, 400);
        }
      }

      return ctx.json({ error: throwError(e) }, 500)
    }
  })