import { Hono } from "hono";
import { throwError } from "@repo/lib/helpers/throw-error";
import { forumDB } from "#shared/database/forum-db.ts";
import { userPreferenceAndPrivateValidation } from "#utils/validate-user-preference-private.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";

async function getUserReferals(nickname: string) {
  return await forumDB
  .selectFrom("refferals")
  .innerJoin("users", "users.nickname", "refferals.recipient")
  .select([
    "refferals.id",
    "refferals.recipient",
    "users.donate",
    "users.name_color",
    "users.description"
  ])
  .where("initiator", "=", nickname)
  .execute()
}

export const getUserReferalsRoute = new Hono()
  .get("/get-user-referals/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param();

    const initiator = getNickname()

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const referals = await getUserReferals(recipient);

      return ctx.json({ data: referals }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })