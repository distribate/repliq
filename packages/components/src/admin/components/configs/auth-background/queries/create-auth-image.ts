'use server'

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { decode } from 'base64-arraybuffer'
import { nanoid } from 'nanoid';

type CreateAuthImageResult = {
  error: 'limit' | 'no-data'
} | string[]

export async function createAuthImage(
  files: string[]
): Promise<CreateAuthImageResult> {
  const supabase = createClient();
  
  if (!files.length) {
    return { error: 'no-data' };
  }
  
  let imagesId: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const decodedFile = decode(files[i])
    
    const randomId = nanoid();
    
    const { data, error } = await supabase
    .storage
    .from('static')
    .upload(`auth_background/auth-image-${randomId}.png`, decodedFile, {
      contentType: "image/png"
    });
    
    if (error) {
      console.error(error.message)
      
      return {
        error: 'no-data',
      };
    }
    
    imagesId.push(data.id);
  }
  
  return imagesId;
}