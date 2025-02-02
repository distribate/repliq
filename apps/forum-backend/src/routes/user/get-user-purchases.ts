import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getUserPurchases(nickname: string) {
  // return await paymentsDB
  // .selectFrom("payments")
  // .leftJoin("payments_fiat")
  // .selectAll()
  // .where("nickname", "=", nickname)
  // .execute();
  return []
}

export const getUserPurchasesRoute = new Hono()
  .get("/get-user-purchases", async (ctx) => {
    const nickname = getNickname()

    try {
      const payments = await getUserPurchases(nickname)

      return ctx.json({ data: payments }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })