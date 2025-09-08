import { toast } from "sonner";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { userClient } from "#shared/forum-client"
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema"
import * as z from "zod"
import { action, atom, batch } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model";
import { validateResponse } from "#shared/api/validation";

export const CREATE_ISSUE_LIMITATIONS: Record<string, string> = {
  "daily_limit": "Сообщение можно создать только раз в сутки"
} as const

export type CreateIssue = z.infer<typeof createIssueSchema>

export const issueTypeAtom = atom<"bug" | "suggestion" | "game">("bug", "issueType")
export const issueDescAtom = atom("", "issueDesc")
export const issueTitleAtom = atom("", "issueTitle")

export const onChange = action(async (ctx, e, type: "title" | "desc") => {
  const { value } = e.target

  await ctx.schedule(() => sleep(200))

  if (type === 'title') {
    issueTitleAtom(ctx, value)
  }

  if (type === 'desc') {
    issueDescAtom(ctx, value)
  }
}, "onChange").pipe(withConcurrency())

export const isValidAtom = atom((ctx) => {
  const title = ctx.spy(issueTitleAtom)
  const desc = ctx.spy(issueDescAtom)
  const type = ctx.spy(issueTypeAtom)

  const result = createIssueSchema.safeParse({ title, description: desc, type })

  return result.success
}, "isValid")

export const createIssueAction = reatomAsync(async (ctx) => {
  const title = ctx.get(issueTitleAtom)
  const description = ctx.get(issueDescAtom)
  const type = ctx.get(issueTypeAtom)

  return await ctx.schedule(async () => {
    const res = await userClient.user["issue"]["create"].$post({ json: { title, description, type } })
    return validateResponse<typeof res>(res)
  })
}, {
  name: "createIssueAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(CREATE_ISSUE_LIMITATIONS[e.message])
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    batch(ctx, () => {
      userGlobalOptionsAtom(ctx, (state) => ({ ...state, can_create_issue: false }))
      toast.success(`Заявка создана!`)
    })
  }
}).pipe(withStatusesAtom())