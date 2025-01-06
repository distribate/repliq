import { checkProfileStatus } from "@repo/lib/helpers/check-profile-status"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { useQuery } from "@tanstack/react-query"

export const PROFILE_STATUS_QUERY_KEY = (requestedUserNickname: string) =>
  createQueryKey("user", ["profile-status"], requestedUserNickname)

export const profileStatusQuery = (requestedUserNickname: string) => useQuery({
  queryKey: PROFILE_STATUS_QUERY_KEY(requestedUserNickname),
  queryFn: () => checkProfileStatus(requestedUserNickname),
})