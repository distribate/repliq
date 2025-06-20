import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserInfo } from "#lib/queries/user/get-user-info.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { getPublicUrl } from '#utils/get-public-url.ts';
import { Encoder } from 'cbor-x';
import { USER_IMAGES_BUCKET } from '@repo/shared/constants/buckets';

export const getMeRoute = new Hono()
  .get("/get-me", async (ctx) => {
    const nickname = getNickname()

    try {
      const {
        accept_friend_request, cover_outline_visible, game_stats_visible,
        profile_visibility, real_name_visible, send_notifications, show_game_location, notify_in_telegram,
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
        show_game_location,
        notify_in_telegram
      }

      if (user.cover_image) {
        cover_image = getPublicUrl(USER_IMAGES_BUCKET, user.cover_image)
      }

      const res = {
        data: {
          ...user,
          cover_image,
          is_donate: user.is_donate,
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