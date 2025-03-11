import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { useSuspenseQuery } from "@tanstack/react-query"

export type UserSettingsQuery = {
  current: "main" | "profile" | "account" | "other" | "lands",
  global: boolean
}

export const USER_SETTINGS_QUERY_KEY = createQueryKey("ui", ["settings-modal"])

export const userSettingsQuery = () => useSuspenseQuery<UserSettingsQuery, Error>({
  queryKey: USER_SETTINGS_QUERY_KEY,
  initialData: {
    current: "main",
    global: false
  }
})