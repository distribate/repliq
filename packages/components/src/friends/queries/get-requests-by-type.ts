import { forumUserClient } from "@repo/shared/api/forum-client";
import { FriendRequestEntity } from "@repo/types/entities/entities-type.ts";

export type FriendsRequestsType = "incoming" | "outgoing";

export async function getRequestsByType(type: FriendsRequestsType): Promise<FriendRequestEntity[] | null> {
  const res = await forumUserClient().user["get-friend-requests"].$get({
    query: { type },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.length ? data : null;
}