import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { userPreferenceAndPrivateValidation } from "#utils/validate-user-preference-private.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

// TODO
async function getUserPublicSocials(nickname: string) {
  return []
}

export const getUserPublicSocialsRoute = new Hono()
  .get("/get-user-public-socials/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param()
    const initiator = getNickname()

    const isValid = await userPreferenceAndPrivateValidation({ initiator, recipient })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const data = await getUserPublicSocials(recipient);

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })