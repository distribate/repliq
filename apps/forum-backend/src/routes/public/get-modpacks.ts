import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { Hono } from "hono";

async function getModpacks() {
  const query = await sqliteDB
    .selectFrom("modpack")
    .selectAll()
    .execute()

  return query.map(m => {
    const mods = JSON.parse(m.mods) as string[]
    const shaders = m.shaders ? JSON.parse(m.shaders) as string[] : []

    return {
      ...m, mods, shaders,
      imageUrl: getPublicUrl(STATIC_IMAGES_BUCKET, m.imageUrl ?? "/modpacks/art-bzzvanet.jpg")
    }
  });
}

export const getModpacksRoute = new Hono()
  .get("/get-modpacks", async (ctx) => {
    try {
      const modpacks = await getModpacks()

      ctx.header("Cache-Control", "public, max-age=60")

      return ctx.json({ data: modpacks }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })