import { toast } from "sonner";
import { createIssue, CreateIssue } from "../queries/create-issue";
import { reatomAsync, withStatusesAtom } from "@reatom/async";

export const CREATE_ISSUE_LIMITATIONS: Record<string, string> = {
  "daily_limit": "Сообщение можно создать только раз в сутки"
} as const

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