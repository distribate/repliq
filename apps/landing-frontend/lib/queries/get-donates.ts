"use server"

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { DonateEntity } from '@repo/types/entities/entities-type.ts';

export async function getDonates() {
  const api = createClient()
  
  const { data, error } = await api
    .from("landing_donate")
    .select()
    .returns<DonateEntity[] | null>()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data && data.length ? data : null;
}