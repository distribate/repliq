import { toast } from "sonner";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { forumUserClient } from "#shared/forum-client"
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema"
import * as z from "zod"
import { action, atom } from "@reatom/core";
import { sleep, withComputed, withConcurrency } from "@reatom/framework";
import { globalPreferencesAtom } from "#components/user/settings/main/models/update-global-preferences.model";
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model";

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
}).pipe(withConcurrency())

export const isValidAtom = atom(false, "isValid").pipe(withComputed((ctx) => {
  const title = ctx.spy(issueTitleAtom)
  const desc = ctx.spy(issueDescAtom)
  const type = ctx.spy(issueTypeAtom)

  const result = createIssueSchema.safeParse({ title, description: desc, type })

  return result.success
}))

async function createIssue(values: CreateIssue) {
  const res = await forumUserClient.user["create-issue"].$post({ json: values })
  const data = await res.json()
  return data
}

export const createIssueAction = reatomAsync(async (ctx) => {
  const title = ctx.get(issueTitleAtom)
  const desc = ctx.get(issueDescAtom)
  const type = ctx.get(issueTypeAtom)

  return await ctx.schedule(() => createIssue({ title, description: desc, type }))
}, {
  name: "createIssueAction",
  onFulfill: (ctx, res) => {
    if (!res) return

    if ("error" in res) {
      return toast.error(CREATE_ISSUE_LIMITATIONS[res.error])
    }

    if (res.status) {
      toast.success(`Заявка создана!`)
      userGlobalOptionsAtom(ctx, (state) => ({ ...state, can_create_issue: false }))
    }
  }
}).pipe(withStatusesAtom())