'use server';

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { Tables } from '@repo/types/entities/gen-supabase.ts';

function getCurrencyImage(path: string) {
  const api = createClient()
  
  const { data } = api
    .storage
    .from("static")
    .getPublicUrl(path)
  
  return data.publicUrl
}

export async function getCurrencies() {
  const api = createClient();
  
  const { data, error } = await api
  .from('landing_currencies')
  .select()
  .returns<Tables<'landing_currencies'>[] | null>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  const currencies = data?.map((item) => {
    const imageUrl = getCurrencyImage(item.imageUrl);
    
    return { ...item, imageUrl }
  }) ?? null
  
  return currencies
}