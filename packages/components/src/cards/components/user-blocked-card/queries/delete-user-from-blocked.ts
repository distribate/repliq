"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";

export type DeleteUserFromBlocked = {
  currentUserNickname: string;
  targetUserNickname: string;
};

export async function deleteUserFromBlocked({
  currentUserNickname,
  targetUserNickname,
}: DeleteUserFromBlocked) {
  const api = createClient();

  const { data, error } = await api
    .from("users_blocked")
    .delete()
    .eq("user_1", currentUserNickname)
    .eq("user_2", targetUserNickname)
    .select("user_1")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}