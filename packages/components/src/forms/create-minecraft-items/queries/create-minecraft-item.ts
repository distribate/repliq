"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";
import { Tables } from '@repo/types/entities/supabase.ts';
import { decode } from 'base64-arraybuffer';
import { nanoid } from 'nanoid';

export type CreateMinecraftItem = Omit<Tables<"config_minecraft_items">, "id">

async function uploadMinecraftItemImage(file: string) {
  const api = createClient();
  
  const decodedImage = decode(file);
  const uniqueFileNameId = nanoid(3)
  const fileName = `items/minecraft-item-${uniqueFileNameId}`
  
  const { data, error } = await api
  .storage
  .from("static")
  .upload(fileName, decodedImage, {
    contentType: "image/png"
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}

export async function createMinecraftItem(
  values: CreateMinecraftItem
) {
  const api = createClient();
  
  const fileName = await uploadMinecraftItemImage(values.image);
  
  const insertValues = {
    title: values.title, image: fileName.path, description: values.description
  }
  
  const { data, error } = await api
  .from("config_minecraft_items")
  .insert(insertValues)
  .select()
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}