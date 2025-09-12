import { getSupabaseClient } from "#shared/supabase/index.ts"
import { getPublicUrl } from "#utils/get-public-url.ts"
import { throwError } from "#utils/throw-error.ts"
import { Hono } from "hono"
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets"

async function getImagesLibrary() {
   const supabase = getSupabaseClient();
   
  const { data, error } = await supabase
    .storage
    .from(USER_IMAGES_BUCKET).list("default", { limit: 16, offset: 0 })

  if (error) {
    throw new Error(error.message)
  }

  return data.map((image) => ({
    name: image.name,
    id: image.id,
    url: getPublicUrl(USER_IMAGES_BUCKET, `default/${image.name}`)
  }))
}

export const getImagesLibraryRoute = new Hono()
  .get("/library/images", async (ctx) => {
    try {
      const images = await getImagesLibrary()

      return ctx.json({ data: images }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })