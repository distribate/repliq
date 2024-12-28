"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";

type PublicUrlFromStorage = {
  bucket: string;
  fileName: string;
};

export async function getPublicUrlFromStorage({
  bucket,
  fileName,
}: PublicUrlFromStorage): Promise<string> {
  const supabase = createClient();

  let url: string;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

  url = data.publicUrl;

  return url;
}
