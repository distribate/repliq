'use server';

import { createClient } from "@repo/lib/utils/api/server.ts";
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { getPublicUrlFromStorage } from '../utils/storage/get-public-url-from-storage.ts';

type FavoriteItemProperties = Pick<UserEntity, 'favorite_item' | "nickname">

export type FavoriteItemType = Partial<{
  type: 'nickname' | 'itemId',
}> & Partial<FavoriteItemProperties>

export type FavoriteItem = {
  id: string,
  image: string,
  title: string
}

export async function getFavoriteItem({
  favorite_item, type = 'itemId', nickname
}: FavoriteItemType): Promise<FavoriteItem | null> {
  const supabase = createClient();
  
  let item: FavoriteItem | null = null;
  
  let query = (id: string) => supabase
  .from('config_minecraft_items')
  .select('title, image, id')
  .eq('id', id)
  .single();
  
  if (type === 'itemId') {
    if (!favorite_item) return null;
    
    const { data: favoriteItemById, error: favoriteItemByIdErr } = await query(
      favorite_item.toString()
    );
    
    if (favoriteItemByIdErr || !favoriteItemById) return null;
 
    item = favoriteItemById;
  }
  
  if (type === 'nickname') {
    const { data: favoriteItemIdByNickname } = await supabase
      .from("users")
      .select("favorite_item")
      .eq("nickname", nickname)
      .single()
    
    if (!favoriteItemIdByNickname) return null;
    
    const { data: favoriteItemByNickname, error: favoriteItemByNicknameErr } = await query(
      favoriteItemIdByNickname.favorite_item
    )
    
    if (favoriteItemByNicknameErr || !favoriteItemByNickname) return null;

    item = favoriteItemByNickname;
  }
  
  if (!item) return null;
  
  const url = await getPublicUrlFromStorage({
    bucket: 'static', fileName: item.image,
  });
  
  return { title: item.title, id: item.id, image: url };
}