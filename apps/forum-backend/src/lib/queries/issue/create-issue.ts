import { forumDB } from "#shared/database/forum-db.ts"
import type { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema"
import type { z } from "zod/v4"

type CreateIssue = z.infer<typeof createIssueSchema> & {
  nickname: string
}

export async function createIssue({
  title, description, nickname: user_nickname, type
}: CreateIssue) {
  return forumDB
    .insertInto("issues")
    // @ts-expect-error
    .values({
      title,
      description,
      user_nickname,
      type
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}