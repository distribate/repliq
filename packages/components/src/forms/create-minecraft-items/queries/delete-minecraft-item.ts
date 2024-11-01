"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";
import { MinecraftItemEntity } from '@repo/types/entities/entities-type.ts';

export type DeleteMinecraftItem = Pick<MinecraftItemEntity, "id" | "image">

async function getImageFromMinecraftItem(id: number) {
  const api = createClient();
  
  const { data, error } = await api
    .from("config_minecraft_items")
    .select("image")
    .eq("id", id)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data.image;
}

async function deleteMinecraftItemImage(itemId: Pick<DeleteMinecraftItem, "id">["id"]) {
  const api = createClient();
  
  const imagePath = await getImageFromMinecraftItem(itemId)
  
  const { error } = await api
    .storage
    .from("static")
    .remove([imagePath])
  
  return error;
}

export async function deleteMinecraftItem(values: DeleteMinecraftItem) {
  const api = createClient();
  
  const deletedImageError = await deleteMinecraftItemImage(values.id);
  
  if (deletedImageError) return; // if storage error exists
  
  const { data, error } = await api
    .from("config_minecraft_items")
    .delete()
    .eq("id", values.id)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}