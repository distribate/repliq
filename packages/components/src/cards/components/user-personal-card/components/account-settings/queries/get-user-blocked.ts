'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { USER } from '@repo/types/entities/entities-type.ts';

type GetUserBlocked = {
  nickname: string
}

type PromiseBlocked = {
  added_at: string
} & USER

export async function getUserBlocked({
  nickname,
}: GetUserBlocked): Promise<PromiseBlocked[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('users_blocked')
  .select('created_at, user_2, users!public_users_blocked_user_2_fkey(*)')
  .eq('user_1', nickname)
  .returns<{
    created_at: string,
    user_2: string,
    users: USER[]
  }[]>();

  if (error) return null;
  
  const users = data.map(item => ({
    ...item.users,
    added_at: item.created_at,
  })).flat()
  
  return users as PromiseBlocked[];
}