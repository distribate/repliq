'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { Tables } from '@repo/types/entities/supabase';

type GetUsers = Pick<Tables<"users">, "id" | "nickname" | "name_color" | "uuid" | "created_at" | "description">

export async function getUsers() {
  const supabase = createClient();
  
  const { data, status, error } = await supabase
  .from('users')
  .select("id, nickname, uuid, created_at, name_color, description")
  .returns<GetUsers[]>()
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (status === 400) return null;
  
  return data;
}