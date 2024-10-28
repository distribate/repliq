'use server';

import { createClient } from "@repo/lib/utils/api/server.ts";
import { getPublicUrlFromStorage } from '../utils/storage/get-public-url-from-storage.ts';
import { MinecraftItemEntity } from '@repo/types/entities/entities-type.ts';

export async function getAvailableMinecraftItems(): Promise<MinecraftItemEntity[] | null> {
  const supabase = createClient();
  
  let items: MinecraftItemEntity[] = [];
  
  const { data, error } = await supabase
  .from('config_minecraft_items')
  .select()
  .returns<MinecraftItemEntity[]>()
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data) return null;
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    const url = await getPublicUrlFromStorage({
      bucket: 'static', fileName: item.image,
    });
    
    if (url) items.push({
      ...item, image: url
    });
  }
  
  return items;
}