"use server"

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { Tables } from '@repo/types/entities/gen-supabase.ts';

function getModpackImage(path: string | null) {
  const api = createClient()
  
  const defaultImage = "/modpacks/art-bzzvanet.jpg"
  
  const { data } = api.storage.from("static").getPublicUrl(path ?? defaultImage)
  
  return data.publicUrl
}

export const getModpacks = async () => {
  const api = createClient()
  
  const { data, error } = await api
    .from("landing_modpack")
    .select()
    .returns<Tables<"landing_modpack">[] | null>()
  
  if (error) return null
  
  return data?.map(item => {
    const image = getModpackImage(item.imageUrl)
    
    return {
      ...item,
      imageUrl: image
    }
  }) ?? null;
}