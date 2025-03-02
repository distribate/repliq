import { forumUserClient } from "@repo/shared/api/forum-client"
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema"
import { z } from "zod"

export type CreateIssue = z.infer<typeof createIssueSchema>

export async function createIssue(values: CreateIssue) {
  const res = await forumUserClient.user["create-issue"].$post({
    json: values
  })

  const data = await res.json()
  
  return data
}