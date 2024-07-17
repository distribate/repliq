"use server"

import { createClient } from '@repo/lib/utils/supabase/server.ts';

type ThreadImages = {
  thread_id: string
}

export async function getThreadsImages({
  thread_id
}: ThreadImages) {
  const supabase = createClient();
  
  if (!thread_id) return;
  
  let images: string[] = []
  
  const { data, error } = await supabase
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id);
  
  if (error) throw new Error(error.message);
  
  if (data[0].images.length) {
    const { data: signedUrls, error } = await supabase
    .storage
    .from('threads')
    .createSignedUrls(data[0].images, 600);
    
    if (error) throw new Error(error.message);
    
    images = signedUrls.map(item => item.signedUrl);
  }
  
  return images;
}