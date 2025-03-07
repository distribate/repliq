import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserInfo } from "#lib/queries/user/get-user-info.ts";
import { getUserIsBanned } from "#lib/queries/user/get-user-is-banned.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { UserDonateVariant } from "@repo/types/entities/entities-type";
import { Hono } from "hono";
import { getPublicUrl } from '#utils/get-public-url.ts';
import { Encoder } from 'cbor-x';
import { createMiddleware } from 'hono/factory';
import { USER_IMAGES_BUCKET } from '@repo/shared/constants/buckets';

export const validateBanStatus = createMiddleware(async (ctx, next) => {
  const nickname = getNickname()
  const isBanned = await getUserIsBanned(nickname);

  if (isBanned) {
    return ctx.json({ data: isBanned, status: "You are banned" }, 400);
  }

  ctx.header('Cache-Control', 'public, max-age=20')

  await next()
})

export const getMeRoute = new Hono()
  .use(validateBanStatus)
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
        cover_image = getPublicUrl(USER_IMAGES_BUCKET, user.cover_image)
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