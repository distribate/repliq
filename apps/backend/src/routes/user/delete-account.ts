import bcrypt from 'bcryptjs';
import { Hono } from "hono";
import { throwError } from "#utils/throw-error.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

async function deleteAccount({ nickname }: { nickname: string }) {
  const query = await forumDB
    .updateTable("users")
    .set({ account_status: "deleted" })
    .where("nickname", "=", nickname)
    .execute()

  return query;
}

// todo: implement scheduled job for deleting account after 90 days

async function restoreAccount({ nickname }: { nickname: string }) {
  const query = await forumDB
    .updateTable("users")
    .set({ account_status: null })
    .where("nickname", "=", nickname)
    .execute()

  return query;
}

export const restoreAccountRoute = new Hono()
  .post("/restore-account", async (ctx) => {
    const nickname = getNickname()

    try {
      const result = await restoreAccount({ nickname })

      if (!result) {
        return ctx.json({ error: "Something went wrong" }, 500)
      }

      return ctx.json({ status: "Account restored" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })

const deleteAccountSchema = z.object({
  password: z.string().min(6),
})

async function deleteAllSessions() {
  

}

export const deleteAccountRoute = new Hono()
  .post("/delete-account", zValidator("json", deleteAccountSchema), async (ctx) => {
    const nickname = getNickname()
    const { success, data } = deleteAccountSchema.safeParse(await ctx.req.json())

    if (!success) {
      return ctx.json({ error: "Password is required" }, 400)
    }

    try {
      // todo: replace to module
      const user = await forumDB
        .selectFrom("users_credentials")
        .innerJoin("users", "users.id", "users_credentials.user_id")
        .select('hash')
        .where('users.nickname', '=', nickname)
        .executeTakeFirstOrThrow()

      const isPasswordValid = bcrypt.compareSync(data.password, user.hash)

      if (!isPasswordValid) {
        return ctx.json({ error: "Invalid password" }, 400)
      }
      // 

      const result = await deleteAccount({ nickname })

      if (!result) {
        return ctx.json({ error: "Something went wrong" }, 500)
      }

      return ctx.json({ status: "Account deleted" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })