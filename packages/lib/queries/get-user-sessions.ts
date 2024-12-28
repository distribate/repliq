"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { UsersSessionEntity } from "@repo/types/entities/entities-type.ts";
import { getCurrentSession } from "#actions/get-current-session.ts";

export type UserSessions = Omit<
  UsersSessionEntity,
  "id" | "isBot" | "expires_at"
> & {
  current: boolean;
};

export const getUserActiveSessions = async (): Promise<
  UserSessions[] | null
> => {
  return null
  // const current = await getCurrentSession();
  // if (!current) return null;
  //
  // const api = createClient();
  //
  // let query = api
  //   .from("users_session")
  //   .select("user_id, browser, os, ua, cpu, ip, uuid")
  //
  // const { data, error } = await query.eq("user_id", current.user?.id);
  //
  // if (error) {
  //   throw new Error(error.message);
  // }
  //
  // return data.map((session) => {
  //   return {
  //     ...session,
  //     current: current.user?.id === session.user_id,
  //   };
  // });
};
