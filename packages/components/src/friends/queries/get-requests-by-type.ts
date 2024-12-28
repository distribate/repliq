"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { FriendRequestEntity } from "@repo/types/entities/entities-type.ts";

export type FriendsRequestsType = "incoming" | "outgoing";

type GetRequestsByType = {
  type: FriendsRequestsType;
  nickname: string;
};

export async function getRequestsByType({
  type,
  nickname,
}: GetRequestsByType): Promise<FriendRequestEntity[]> {
  const requestType = type === "incoming" ? "recipient" : "initiator";

  const api = createClient();

  const { data: friendsRequests, error } = await api
    .from("friends_requests")
    .select("id, recipient, initiator, created_at")
    .eq(requestType, nickname)
    .returns<FriendRequestEntity[]>();

  if (error) {
    throw new Error(error.message);
  }

  return friendsRequests;
}
