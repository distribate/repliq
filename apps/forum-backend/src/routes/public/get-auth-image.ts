import { supabase } from "#shared/supabase/supabase-client.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

const getAuthImageSchema = z.object({
  id: z.string().transform(Number).optional(),
  random: z.string().transform((val) => val === "true").optional(),
}).refine(
  (data) => data.id !== undefined || data.random !== undefined,
  {
    message: "Either 'id' or 'random' must be provided",
  }
);

const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min;

export const getAuthImageRoute = new Hono()
  .get("/get-auth-image", zValidator("query", getAuthImageSchema), async (ctx) => {
    const query = ctx.req.query();
    const { id, random } = getAuthImageSchema.parse(query);

    try {
      const { data: authImages } = await supabase
        .storage
        .from("static")
        .list("auth_background", {
          limit: 100,
          offset: 0,
        })

      if (!authImages) {
        return ctx.json({ error: "Auth images not found" }, 404)
      }

      let authImage;

      if (random) {
        const l = getRandomArbitrary(1, authImages.length);

        authImage = authImages[Math.floor(l)]
      } else {
        authImage = authImages.find(image => image.name === `${id}.png`)
      }

      if (!authImage) {
        return ctx.json({ error: "Auth image not found" }, 404)
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from("static")
        .getPublicUrl(`auth_background/${authImage.name}`)

      return ctx.json({ data: publicUrl }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })