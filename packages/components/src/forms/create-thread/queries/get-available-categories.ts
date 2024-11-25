'use server';

import 'server-only';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { CategoryEntity } from '@repo/types/entities/entities-type.ts';

export async function getAvailableCategories() {
  const api = createClient();
  
  const { data, error } = await api
  .from('category')
  .select('id, title, description')
  .eq('available', true)
  .returns<Pick<CategoryEntity, "id" | "title" | "description">[]>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}