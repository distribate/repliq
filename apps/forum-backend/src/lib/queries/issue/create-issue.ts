import { forumDB } from "#shared/database/forum-db.ts"
import type { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema"
import type { z } from "zod"

type CreateIssue = z.infer<typeof createIssueSchema> & {
  nickname: string
}

export async function createIssue({
  title, description, nickname: user_nickname, type
}: CreateIssue) {
  return await forumDB
    .insertInto("issues")
    // @ts-ignore
    .values({
      title,
      description,
      user_nickname,
      type
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}