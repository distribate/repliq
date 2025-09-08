import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { throwError } from "#utils/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";

const editAvatarRouteSchema = z.object({
  type: z.enum(["set-as-main"])
})

async function setAsMain(
  id: number,
  nickname: string
) {
  const { avatars: existingAvatars } = await forumDB
    .selectFrom("users")
    .select("avatars")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  // main avatar = last element of array
  const selectedAvatarIndex = id;

  const updatedAvatar = existingAvatars[selectedAvatarIndex]

  const updatedAvatars = [
    ...existingAvatars.filter((_, index) => index !== selectedAvatarIndex),
    updatedAvatar
  ];

  const update = await forumDB
    .updateTable("users")
    .set({
      avatar: updatedAvatar,
      avatars: updatedAvatars
    })
    .where("nickname", "=", nickname)
    .returning(["avatars", "avatar"])
    .executeTakeFirstOrThrow()

  return {
    avatars: update.avatars,
    avatar: update.avatars[2]
  }
}

export const editAvatarRoute = new Hono()
  .post("/update/:id", zValidator("json", editAvatarRouteSchema), async (ctx) => {
    const id = ctx.req.param("id")
    const nickname = getNickname();
    const result = editAvatarRouteSchema.parse(await ctx.req.json());

    try {
      if (result.type === 'set-as-main') {
        const update = await setAsMain(Number(id), nickname)

        const data = {
          data: update
        }

        return ctx.json({ data }, 200);
      }

      return ctx.json({ error: "Type is not defined" }, 500);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })