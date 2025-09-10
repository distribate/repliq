import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#lib/modules/context.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import * as z from "zod";

const connectProfileSchema = z.object({
  type: z.enum(["minecraft"])
})

async function connectProfile(
  nickname: string, 
  { type }: { type: "minecraft" }
) {
  const { id } = await forumDB
    .selectFrom("users")
    .select("id")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  const isValid = false;

  if (!isValid) return;

  const query = await forumDB.transaction().execute(async (trx) => {
    const profile = await trx
      .insertInto("users_profiles")
      // @ts-ignore
      .values({ user_id: id, type: "minecraft" })
      .returning("id")
      .executeTakeFirst()

    if (!profile) return;

    const getMinecraftUUID = () => ""

    const uuid = getMinecraftUUID()

    switch (type) {
      case "minecraft":
        const minecraftProfile = await trx
          .insertInto("minecraft_profiles")
          .values({ profile_id: profile.id, nickname, uuid })
          .returning("profile_id")
          .executeTakeFirst()

        return minecraftProfile
    }
  })

  return query;
}

export const connectProfileRoute = new Hono()
  .post("/connect-profile", zValidator('json', connectProfileSchema), async (ctx) => {
    const nickname = getNickname()
    const { type } = connectProfileSchema.parse(await ctx.req.json())

    try {
      if (type === 'minecraft') {
        // todo: implement integration's server health check
        const isOnline = false

        if (!isOnline) {
          return ctx.json({ error: "Minecraft Service is offline" }, 200);
        }
      }

      const result = await connectProfile(nickname, { type })

      if (!result) {
        return ctx.json({ error: "Failed to connect profile" }, 500)
      }

      return ctx.json({ data: result, status: "Connected" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })