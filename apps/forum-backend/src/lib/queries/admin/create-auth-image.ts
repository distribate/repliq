import { supabase } from "#shared/supabase/supabase-client.ts";
import { z } from "zod/v4";
import { createAuthImageSchema } from "@repo/types/schemas/admin/create-auth-image-schema";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";

async function uploadImages(f: File[]) {
  for (let i = 0; i < f.length; i++) {
    const file = f[i];

    await supabase.storage
      .from(STATIC_IMAGES_BUCKET)
      .upload(`auth_background/auth-image-${i}.png`, file, {
        contentType: "image/png",
      })
  }
}

export const createAuthImage = async ({
  files
}: z.infer<typeof createAuthImageSchema>) => {
 
  // @ts-ignore
  await uploadImages(files);
}