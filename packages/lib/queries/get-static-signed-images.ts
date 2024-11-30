"use server"

import "server-only"
import { createClient } from "#utils/api/supabase-client.ts";

type GetStaticSignedImages = {
  fileName: string
}

export async function getStaticImages({
  fileName
}: GetStaticSignedImages): Promise<string | null> {
  const api = createClient();
  
  const { data } = await api
  .storage
  .from('static')
  .createSignedUrl(fileName, 10)
  
  if (!data || !data.signedUrl) return null;
  
  return data.signedUrl;
}