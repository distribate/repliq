import { getFriendship } from "#lib/queries/friend/get-friendship.ts";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getUserProfilePreview, getUser, type GetUserType } from "#lib/queries/user/get-user.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { isProduction } from "@repo/lib/helpers/is-production";
import { throwError } from "@repo/lib/helpers/throw-error";
import { logger } from "@repo/lib/utils/logger";
import { Hono } from "hono";

type UserProfileStatus = "banned" | "private" | "blocked-by-you" | "blocked-by-user" | null

async function createUserProfileView(initiator: string, recipient: string): Promise<void> {
  const conditionDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  const isExists = await forumDB
    .selectFrom("profile_views")
    .where("created_at", ">", conditionDate)
    .where("recipient", "=", recipient)
    .where("initiator", "=", initiator)
    .select("id")
    .executeTakeFirst()

  if (isExists) return;

  await forumDB
    .insertInto("profile_views")
    .values({ recipient, initiator })
    .execute()
}

async function validateExistsUser(nickname: string) {
  const query = await forumDB
    .selectFrom("users")
    .select("nickname")
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  return Boolean(query?.nickname)
}

const SHORTED_MAP: Record<Exclude<NonNullable<UserProfileStatus>, "banned">, GetUserType> = {
  "private": "shorted",
  "blocked-by-you": "shorted",
  "blocked-by-user": "shorted",
}

export const getUserProfileRoute = new Hono()
  .get("/get-user-profile/:nickname", async (ctx) => {
    const recipient = ctx.req.param("nickname")
    const initiator = getNickname(true)
    const isExists = await validateExistsUser(recipient)

    if (!isExists) {
      return ctx.json({ error: "Not found" }, 404)
    }

    if (!initiator) {
      const user = await getUserProfilePreview(recipient)

      if (!user) {
        return ctx.json({ error: "Not found" }, 404)
      }

      const { account_status, ...rest } = user

      if (account_status === 'archived' || account_status === "deleted") {
        const data = {
          nickname: rest.nickname,
          details: {
            status: null,
            account_type: account_status
          }
        }

        return ctx.json({ data }, 200)
      }

      const data = {
        ...rest,
        details: {
          status: null,
          account_type: account_status
        },
        profiles: []
      }

      logger.info(`Gived full profile an ${recipient} for non-auth user`)

      return ctx.json({ data }, 200);
    }

    let userType: GetUserType = "shorted"
    let status: UserProfileStatus = null;

    const [relation, friendship] = await Promise.all([
      getUserRelation({ recipient, initiator }),
      getFriendship({ recipient, initiator })
    ])

    if (!friendship) {
      userType = SHORTED_MAP[relation as Exclude<NonNullable<UserProfileStatus>, "banned">]
      status = relation
    } else {
      userType = "detailed"
      status = null;
    }

    try {
      const user = await getUser({ initiator, recipient, type: userType });

      if (!user) {
        return ctx.json({ error: "Not found" }, 404)
      }

      const userExistsProfiles = await forumDB
        .selectFrom("users_profiles")
        .select(["user_id", "type"])
        .where("user_id", "=", user.id)
        .execute()

      if (recipient !== initiator) {
        createUserProfileView(initiator, recipient)
      }

      const { account_status, ...rest } = user;

      if (account_status === 'deleted' || account_status === 'archived') {
        const data = {
          nickname: rest.nickname,
          details: {
            status: null,
            account_type: account_status
          },
        }

        return ctx.json({ data }, 200)
      }

      const data = {
        ...rest,
        details: { status, account_type: account_status },
        profiles: userExistsProfiles as { type: "minecraft", user_id: string }[]
      }

      !isProduction && logger.info(`Gived full profile an ${recipient} for ${initiator}`)

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })