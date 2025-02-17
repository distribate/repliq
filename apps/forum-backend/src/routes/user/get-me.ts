import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserInfo } from "#lib/queries/user/get-user-info.ts";
import { getUserIsBanned } from "#lib/queries/user/get-user-is-banned.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { UserDonateVariant } from "@repo/types/entities/entities-type";
import { Hono } from "hono";
import { getPublicUrl } from '#utils/get-public-url.ts';
import { encode, Encoder } from 'cbor-x';

export const getMeRoute = new Hono()
  .use(async (ctx, next) => {
    const nickname = getNickname()
    const isBanned = await getUserIsBanned(nickname);

    if (isBanned) {
      return ctx.json({ data: isBanned, status: "You are banned" }, 400);
    }

    await next()
  })
  .get("/get-me", async (ctx) => {
    const nickname = getNickname()

    try {
      const {
        accept_friend_request, cover_outline_visible, game_stats_visible,
        profile_visibility, real_name_visible, send_notifications,
        ...user
      } = await getUserInfo(nickname)

      let cover_image: string | null = null

      const preferences = {
        accept_friend_request,
        cover_outline_visible,
        game_stats_visible,
        profile_visibility,
        real_name_visible,
        send_notifications,
      }

      if (user.cover_image) {
        cover_image = getPublicUrl("user_images", user.cover_image)
      }

      const res = {
        data: {
          ...user,
          cover_image,
          donate: user.donate satisfies UserDonateVariant,
          preferences
        }
      }

      const encoder = new Encoder({
        useRecords: false, structures: [], pack: true
      });

      const encodedUser = encoder.encode(res)

      return ctx.body(
        encodedUser as unknown as ReadableStream, 
        200, 
        { 'Content-Type': 'application/cbor' }
      )
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })