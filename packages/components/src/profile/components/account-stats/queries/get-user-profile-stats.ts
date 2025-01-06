import { forumUserClient } from "@repo/shared/api/forum-client"
import { ProfileStatsDetailed } from "@repo/types/routes-types/get-user-profile-stats-types";

export const getUserProfileStats = async () => {
  const res = await forumUserClient().user["get-user-profile-stats"].$get();

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data as ProfileStatsDetailed
}