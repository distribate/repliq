import { getFriendship } from "#lib/queries/friend/get-friendship.ts";
import { getUserIsViewed } from "#lib/queries/user/get-user-is-viewed.ts";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getUser, type GetUserType } from "#lib/queries/user/get-user.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export const getUserProfileRoute = new Hono()
  .get("/get-user-profile/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param()

    const initiator = getNickname()

    const [userRelation, is_viewed, friendShip] = await Promise.all([
      getUserRelation({ recipient, initiator }),
      getUserIsViewed({ recipient, initiator }),
      getFriendship({ recipient, initiator })
    ])

    let getUserType: GetUserType = "shorted"
    let status: "banned" | "private" | "blocked-by-you" | "blocked-by-user" | null = null;

    if (!friendShip) {
      if (userRelation === "private"
        || userRelation === "blocked-by-you"
        || userRelation === "blocked-by-user"
      ) {
        getUserType = "shorted"
      } else {
        getUserType = "detailed"
      }

      status = userRelation
    } else {
      getUserType = "detailed"

      status = null;
    }

    try {
      const user = await getUser({ initiator, recipient, type: getUserType });

      if (!user) {
        return ctx.json({ error: "User not found" }, 404)
      }

      let cover_image: string | null = null

      if (isUserDetailed(user) && user.cover_image) {
        cover_image = supabase.storage.from("user_images").getPublicUrl(user.cover_image).data.publicUrl
      }

      return ctx.json({
        data: {
          ...user,
          cover_image,
          details: {
            status,
            is_viewed
          }
        }
      }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })