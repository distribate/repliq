"use server";

import { createClient } from "../../../../lib/utils/api/supabase-client.ts";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";
import { THREADS_IMAGES_BUCKET } from "@repo/shared/constants/buckets.ts";

export async function getThreadsImages(
  threadId: Pick<ThreadEntity, "id">["id"],
): Promise<string[] | null> {
  let images: string[] | null = null;

  const api = createClient();

  const { data, error } = await api
    .from("threads_images")
    .select("images")
    .eq("thread_id", threadId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  images = [];

  for (let i = 0; i < data.images.length; i++) {
    const { data: urls } = api.storage
      .from(THREADS_IMAGES_BUCKET)
      .getPublicUrl(data.images[i]);

    images.push(urls.publicUrl);
  }

  return images;
}
