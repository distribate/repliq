import {
  ExtendedUsers,
} from "#admin/components/dashboard/queries/get-users.ts";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

export type SearchingFriend = Omit<ExtendedUsers, "uuid">;

export async function getSearchingFriends(): Promise<SearchingFriend[] | null> {
  const res = await forumUserClient().user["get-recommended-friends"].$get({
    query: { type: "searching" },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data
}
