'use server'

import { decode } from 'base64-arraybuffer'
import { nanoid } from 'nanoid';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type CreateAuthImageResult = {
  error: 'limit' | 'no-data'
} | string[]

export async function createAuthImage(
  files: string[]
): Promise<CreateAuthImageResult> {
  if (!files.length) {
    return { error: 'no-data' };
  }
  
  const api = createClient();
  
  let imagesId: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const decodedFile = decode(files[i])
    
    const randomId = nanoid();
    
    const { data, error } = await api
    .storage
    .from('static')
    .upload(`auth_background/auth-image-${randomId}.png`, decodedFile, {
      contentType: "image/png"
    });
    
    if (error) {
      return {
        error: 'no-data',
      };
    }
    
    imagesId.push(data.id);
  }
  
  return imagesId;
}