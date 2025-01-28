import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserInfo } from "#lib/queries/user/get-user-info.ts";
import { getUserIsBanned } from "#lib/queries/user/get-user-is-banned.ts";
import { getUserSettings } from "#lib/queries/user/get-user-setting.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { UserDonateVariant } from "@repo/types/entities/entities-type";
import { Hono } from "hono";
import { supabase } from '#shared/supabase/supabase-client.ts';

export const getMeRoute = new Hono()
  .use(async (ctx, next) => {
    const nickname = getNickname()
    const isBanned = await getUserIsBanned(nickname);

    if (isBanned) {
      return ctx.json({ error: "You are banned" }, 400);
    }

    await next()
  })
  .get("/get-me", async (ctx) => {
    const nickname = getNickname()

    try {
      const [user, preferences] = await Promise.all([
        getUserInfo(nickname),
        getUserSettings(nickname)
      ]);

      let cover_image: string | null = null

      if (user.cover_image) {
        cover_image = supabase.storage.from("user_images").getPublicUrl(user.cover_image).data.publicUrl
      }

      return ctx.json({
        data: {
          ...user,
          cover_image,
          donate: user.donate satisfies UserDonateVariant,
          preferences
        }
      }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })