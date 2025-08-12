import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserInfo } from "#lib/queries/user/get-user-info.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import type { UserDetailed } from '@repo/types/entities/user-type';

export const getMeRoute = new Hono()
  .get("/get-me", async (ctx) => {
    const nickname = getNickname()

    try {
      const {
        accept_friend_request, cover_outline_visible, game_stats_visible,
        profile_visibility, real_name_visible, send_notifications, show_game_location, notify_in_telegram,
        ...user
      } = await getUserInfo(nickname)

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

      const res: { data: UserDetailed } = {
        data: {
          ...user,
          is_donate: user.is_donate,
          preferences
        }
      }

      ctx.res.headers.set("Cache-Control", "public, max-age=2")

      return ctx.json(res, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })