import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createIssue, CreateIssue } from "../queries/create-issue";

export const CREATE_ISSUE_LIMITATIONS: Record<string, string> = {
  "daily_limit": "Сообщение можно создать только раз в сутки"
} as const

export const useCreateIssue = () => {
  const createIssueMutation = useMutation({
    mutationFn: async (values: CreateIssue) => createIssue(values),
    onSuccess: async (data) => {
      if (!data) return

      if ("error" in data) {
        return toast.error(CREATE_ISSUE_LIMITATIONS[data.error])
      }

      toast.success(`Проблема создана!`)
    },
    onError: e => { throw new Error(e.message) }
  })

  return { createIssueMutation }
}