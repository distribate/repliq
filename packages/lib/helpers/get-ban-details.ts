'use server';

import 'server-only';
import { createClient } from '../utils/supabase/server.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

type GetBanDetails = Pick<UserEntity, 'nickname'>

export type PromiseBanDetails = Omit<Tables<'users_banned'>, 'id' | 'created_at'>

export async function getBanDetails({
  nickname,
}: GetBanDetails): Promise<PromiseBanDetails> {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('users_banned')
  .select('reason, nickname, time')
  .eq('nickname', nickname)
  .returns<PromiseBanDetails>()
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}