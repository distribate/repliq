'use server';

import 'server-only';
import { createClient } from "#utils/api/supabase-client.ts";
import { BanEntity, UserEntity } from '@repo/types/entities/entities-type.ts';

type GetBanDetails = Pick<UserEntity, 'nickname'>

export type BanDetails = Omit<BanEntity, 'id' | 'created_at' | "reason">

export async function getBanDetails({
  nickname,
}: GetBanDetails): Promise<BanDetails> {
  const api = createClient();
  
  const { data, error } = await api
  .from('users_banned')
  .select()
  .eq('nickname', nickname)
  .returns<BanDetails>()
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}