import { supabase } from "#shared/supabase/supabase-client.ts"
import { getPublicUrl } from "#utils/get-public-url.ts"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"

async function getImagesLibrary() {
  const { data, error } = await supabase.storage.from("user_images").list("default", {
    limit: 16,
    offset: 0
  })

  if (error) {
    throw error
  }

  return await Promise.all(data.map(async (image) => ({
    name: image.name,
    id: image.id,
    signedUrl: (await getPublicUrl("user_images", `default/${image.name}`)).data.publicUrl
  })))
}

export const getImagesLibraryRoute = new Hono()
  .get("/get-images-library", async (ctx) => {
    try {
      const images = await getImagesLibrary()

      return ctx.json({ data: images }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })