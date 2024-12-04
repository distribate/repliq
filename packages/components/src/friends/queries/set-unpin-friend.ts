"use server";

import "server-only";
import { SetPinFriend } from "./set-pin-friend.ts";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export async function setUnpinFriend({ recipient, friend_id }: SetPinFriend) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  const { data, error, status } = await api
    .from("friends_pinned")
    .delete()
    .eq("friend_id", friend_id)
    .eq("initiator", currentUser?.nickname)
    .eq("recipient", recipient);

  if (error) {
    throw new Error(error.message);
  }

  return { data, status };
}
