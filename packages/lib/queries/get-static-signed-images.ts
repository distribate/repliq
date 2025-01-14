"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";

type GetStaticSignedImages = {
  fileName: string;
};

export async function getStaticImages({
  fileName,
}: GetStaticSignedImages): Promise<string | null> {
  const api = createClient();

  const { data } = api.storage
    .from("static")
    .getPublicUrl(fileName);

  if (!data || !data.publicUrl) return null;

  return data.publicUrl;
}
