"use server";

import "server-only";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type DeleteFriend = {
  error: "not-authorized" | null;
  status: number;
};

export async function deleteFriend(friend_id: string): Promise<DeleteFriend> {
  const { user: currentUser } = await getCurrentSession();

  if (!currentUser)
    return {
      status: 400,
      error: "not-authorized",
    };

  const api = createClient();

  const { error, status } = await api
    .from("users_friends")
    .delete()
    .eq("id", friend_id);

  if (error) {
    throw new Error(error.message);
  }

  console.log(status);

  return { error: null, status };
}
