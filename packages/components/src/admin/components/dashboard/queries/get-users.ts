'use server';

import "server-only"
import { Tables } from '@repo/types/entities/supabase';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type Users = Pick<Tables<"users">, "id" | "nickname" | "name_color" | "uuid" | "created_at" | "description">

export type GetUsers = {
  range?: number[],
  limit?: number
}

export async function getUsers(filter?: GetUsers) {
  const api = createClient();
  
  let query = api
  .from('users')
  .select("id, nickname, uuid, created_at, name_color, description", {
    count: "exact"
  })
  .returns<Users[]>()
  
  if (filter?.range) query.range(filter?.range[0], filter?.range[1])
  if (filter?.limit) query.limit(filter?.limit)
  
  const { data, status, error, count } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (status === 400) return null;
  
  return { data, count };
}