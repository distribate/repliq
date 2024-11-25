"use server";

import { createClient } from "@repo/lib/utils/api/server.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";

type GetUserBlocked = {
  nickname: string;
};

type PromiseBlocked = {
  added_at: string;
} & UserEntity;

export async function getUserBlocked(
  nickname: GetUserBlocked["nickname"],
): Promise<PromiseBlocked[] | null> {
  const api = createClient();

  const { data, error } = await api
    .from("users_blocked")
    .select("created_at, user_2, users!public_users_blocked_user_2_fkey(*)")
    .eq("user_1", nickname)
    .returns<
      { created_at: string; user_2: string; users: UserEntity[]; }[]
    >();

  if (error) return null;

  const users = data.flatMap((item) => ({
    ...item.users,
    added_at: item.created_at,
  }));

  return users as PromiseBlocked[];
}