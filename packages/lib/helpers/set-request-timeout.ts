'use server';

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";
import { validateRequest } from '../utils/auth/validate-requests.ts';
import { RequestTimeoutType } from './check-request-timeout.ts';
import { RequestEntity } from '@repo/types/entities/entities-type.ts';

type CreateRequestTimeout = Pick<RequestEntity,
  "user_nickname" | "issued_at"> & {
  type: string
}

export async function createRequestTimeout({
  type, user_nickname, issued_at
}: CreateRequestTimeout) {
  const { user, session } = await validateRequest();
  if (!user || !session || !type) return null;
  
  const supabase = createClient();
  
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
  
  if (error || !data) {
    return null;
  }
  
  return data;
}