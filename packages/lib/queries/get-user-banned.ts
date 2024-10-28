"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";
import { BanEntity } from '@repo/types/entities/entities-type.ts';

export type UserBanDetails = Omit<BanEntity, "id" | "created_at">

export async function getUserBanned(nickname: string): Promise<UserBanDetails | null> {
  const api = createClient();
  
  const { data, error } = await api
  .from("users_banned")
  .select()
  .eq('nickname', nickname)
  .returns<UserBanDetails>()
  .single()
  
  if (error) {
    return null;
  }
  
  return data;
}