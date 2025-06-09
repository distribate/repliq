import { supabase } from "#shared/supabase/supabase-client.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import type { createMinecraftItemSchema } from "@repo/types/schemas/admin/create-minecraft-item-schema";
import { z } from "zod/v4";

type CreateMinecraftItemSchema = z.infer<typeof createMinecraftItemSchema>;

async function uploadImages({ file, meta }: CreateMinecraftItemSchema) {
  return await supabase.storage
    .from(STATIC_IMAGES_BUCKET)
    .upload(`items/${meta.name}.png`, file, {
      contentType: "image/png",
    })
}

export const createMinecraftItem = async ({
  file,
  meta,
}: z.infer<typeof createMinecraftItemSchema>) => {

  await uploadImages({ file, meta });
}