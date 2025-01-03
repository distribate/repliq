"use server"

import { getCurrentSession } from "@repo/lib/actions/get-current-session";
import { forumUserClient } from "@repo/shared/api/forum-client"
import { ProfileStatsCharts, ProfileStatsMeta, ProfileViewsDetails } from "@repo/types/routes-types/get-user-profile-stats-types";

export const getUserProfileStats = async () => {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["get-user-profile-stats"].$post({
    json: {
      initiator: currentUser.nickname,
      recipient: currentUser.nickname
    },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data as {
    details: ProfileViewsDetails[],
    meta: ProfileStatsMeta,
    charts: ProfileStatsCharts
  }
}