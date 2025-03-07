import { supabase } from "#shared/supabase/supabase-client.ts"
import { getPublicUrl } from "#utils/get-public-url.ts"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets"

async function getImagesLibrary() {
  const { data, error } = await supabase
    .storage
    .from(USER_IMAGES_BUCKET).list("default", { limit: 16, offset: 0 })

  if (error) {
    throw new Error(error.message)
  }

  return await Promise.all(data.map(async (image) => ({
    name: image.name,
    id: image.id,
    signedUrl: getPublicUrl(USER_IMAGES_BUCKET, `default/${image.name}`)
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