'use server';

import { createClient } from '../utils/supabase/server.ts';
import { validateRequest } from '../utils/auth/validate-requests.ts';
import { RequestTimeoutType } from './check-request-timeout.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

type CreateRequestTimeout = Pick<Tables<"users_requests_timeout">, "user_nickname"
  | "issued_at"
> & {
  type: string
}

export async function createRequestTimeout({
  type, user_nickname, issued_at
}: CreateRequestTimeout) {
  const supabase = createClient();
  
  const { user, session } = await validateRequest();
  
  if (!user || !session || !type) return null;
  if (user.nickname !== user_nickname) return null;
  
  if (!type.includes(type as RequestTimeoutType)) return null;
  
  const { data, error } = await supabase
  .from('users_requests_timeout')
  .insert({
    user_nickname: user_nickname,
    type: type,
    issued_at: issued_at
  })
  .select()
  .single();
  
  if (error || !data) return null;
  
  return data;
}