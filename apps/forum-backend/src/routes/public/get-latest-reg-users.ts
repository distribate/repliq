import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { decode, Encoder } from "cbor-x";
import { Hono } from "hono";
import { z } from "zod";

async function getLatestRegUsers({ limit }: { limit?: number }) {
  return await forumDB
    .selectFrom("users")
    .select(["id", "nickname", "name_color", "description"])
    .limit(limit ?? 7)
    .orderBy("created_at", "desc")
    .execute()
}

const getLatestRegUsersSchema = z.object({
  limit: z.string().transform(Number).optional(),
})

export const getLatestRegUsersRoute = new Hono()
  .get("/get-latest-reg-users", zValidator("query", getLatestRegUsersSchema), async (ctx) => {
    const { limit } = getLatestRegUsersSchema.parse(ctx.req.query());

    try {
      const users = await getLatestRegUsers({ limit });

      if (!users.length) {
        return ctx.json({ data: null }, 200)
      }

      const encoder = new Encoder({
        useRecords: false, structures: [], pack: true
      });

      const encodedUsers = encoder.encode(users)

      return ctx.body(
        encodedUsers as unknown as ReadableStream, 
        200, 
        { 'Content-Type': 'application/cbor' }
      )
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })