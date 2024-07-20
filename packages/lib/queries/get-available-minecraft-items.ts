'use server';

import { createClient } from '../utils/supabase/server.ts';
import { Tables } from '@repo/types/entities/supabase.ts';
import { getPublicUrlFromStorage } from '../utils/storage/get-public-url-from-storage.ts';

type MINECRAFT_ITEMS = Tables<'config_minecraft_items'>

export type AvailableMinecraftItem = Omit<MINECRAFT_ITEMS, 'image'> & {
  image: string
}

export async function getAvailableMinecraftItems(): Promise<
  AvailableMinecraftItem[] | null
> {
  const supabase = createClient();
  
  let items: AvailableMinecraftItem[] = [];
  
  const { data, error } = await supabase
  .from('config_minecraft_items')
  .select('id, title, image');
  
  if (error) throw new Error(error.message);
  
  if (!data) return null;
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    const url = await getPublicUrlFromStorage({
      bucket: 'static', fileName: item.image,
    });
    
    if (url) items.push({ ...item, image: url });
  }
  
  return items;
}