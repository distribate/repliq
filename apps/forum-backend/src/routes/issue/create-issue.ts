import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { createIssue } from "#lib/queries/issue/create-issue.ts";
import { publishIssuePayload } from "#publishers/pub-issue-payload.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";

export const createIssueRoute = new Hono()
  .post("/create-issue", zValidator("json", createIssueSchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = createIssueSchema.parse(body)

    const nickname = getNickname()

    try {
      const createdIssue = await createIssue({ ...result, nickname })

      if (!createdIssue) {
        return ctx.json({ error: "Error creating issue" }, 400);
      }

      publishIssuePayload({ title: createdIssue.title, user_nickname: nickname })

      return ctx.json({ status: "Issue created" }, 200)
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "daily_limit") {
          return ctx.json({ error: "daily_limit" }, 400);
        }
      }

      return ctx.json({ error: throwError(e) }, 500)
    }
  }
  )