"use server";

import "server-only";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { authClient } from "@repo/lib/utils/api/auth-client.ts";

export const findPlayerFromServerData = async (
  nickname: string,
): Promise<boolean> => {
  const res = await authClient.get[":detail"].$post({
    param: { detail: nickname },
    json: { fields: ["NICKNAME"] },
  });

  const data = await res.json();

  return !!data;
};

export const getUserFromForumAuthDetails = async (nickname: string) => {
  const api = createClient();

  const { data, error } = await api
    .from("users")
    .select("nickname,id")
    .eq("nickname", nickname)
    .single();

  if (error) return null;

  return data;
};
