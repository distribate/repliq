import { getFriendship } from "#lib/queries/friend/get-friendship.ts";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getUser, type GetUserType } from "#lib/queries/user/get-user.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

type UserProfileStatus = "banned" | "private" | "blocked-by-you" | "blocked-by-user" | null

async function createUserProfileView(initiator: string, recipient: string) {
  const exists = await forumDB
    .selectFrom("profile_views")
    .where("created_at", ">", new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
    .where("recipient", "=", recipient)
    .where("initiator", "=", initiator)
    .select("id")
    .executeTakeFirst()

  if (!exists) {
    await forumDB
      .insertInto("profile_views")
      .values({ recipient, initiator })
      .execute()
  }
}

export const getUserProfileRoute = new Hono()
  .get("/get-user-profile/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param()
    const initiator = getNickname()

    const [userRelation, friendShip] = await Promise.all([
      getUserRelation({ recipient, initiator }),
      getFriendship({ recipient, initiator })
    ])

    let getUserType: GetUserType = "shorted"
    let status: UserProfileStatus = null;

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
        return ctx.json({ error: "Not found" }, 404)
      }

      if (recipient !== initiator) {
        createUserProfileView(initiator, recipient)
      }

      let cover_image: string | null = null

      if ("cover_image" in user && user.cover_image) {
        cover_image = getPublicUrl("user_images", user.cover_image)
      }

      return ctx.json({
        data: {
          ...user,
          cover_image,
          details: { status }
        }
      }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })