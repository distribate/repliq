'use server';

import { createClient } from '../utils/supabase/server.ts';
import { validateRequest } from '../utils/auth/validate-requests.ts';
import { Enums } from '@repo/types/entities/supabase.ts';

type CheckRequestTimeout = {
  type: string,
  nickname: string
}

export type RequestTimeoutType = Enums<'request_timeout_type'>

export async function checkRequestTimeout({
  nickname, type,
}: CheckRequestTimeout): Promise<{
  isAllowed: boolean,
  status: number
} | null> {
  const supabase = createClient();
  
  const { user, session } = await validateRequest();
  
  if (!user || !session) return null;
  if (user.nickname !== nickname) return null;
  
  if (!type.includes(type as RequestTimeoutType)) return null;
  
  const { data, error, status } = await supabase
  .from('users_requests_timeout')
  .select('type, user_nickname')
  .eq('user_nickname', nickname)
  .eq('type', type)
  .single();
  
  if (!data) return {
    isAllowed: true,
    status: 200
  }
  
  if (error) return null;

  return {
    isAllowed: !(data.type === type && data.user_nickname === nickname),
    status
  };
}