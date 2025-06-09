import { toast } from "sonner";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { forumUserClient } from "@repo/shared/api/forum-client"
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema"
import { z } from "zod/v4"

export const CREATE_ISSUE_LIMITATIONS: Record<string, string> = {
  "daily_limit": "Сообщение можно создать только раз в сутки"
} as const

export type CreateIssue = z.infer<typeof createIssueSchema>

async function createIssue(values: CreateIssue) {
  const res = await forumUserClient.user["create-issue"].$post({
    json: values
  })

  const data = await res.json()
  
  return data
}

export const createIssueAction = reatomAsync(async (ctx, values: CreateIssue) => {
  return await ctx.schedule(() => createIssue(values))
}, {
  name: "createIssueAction",
  onFulfill: (_, res) => {
    if (!res) return

    if ("error" in res) {
      return toast.error(CREATE_ISSUE_LIMITATIONS[res.error])
    }

    toast.success(`Заявка создана!`)
  }
}).pipe(withStatusesAtom())