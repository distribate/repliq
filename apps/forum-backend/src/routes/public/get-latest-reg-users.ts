import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Encoder } from "cbor-x";
import { Hono } from "hono";
import * as z from "zod";

const DEFAULT_LIMIT = 7

async function getLatestRegUsers({ limit }: { limit?: number }) {
  const query = await forumDB
    .selectFrom("users")
    .select(["id", "nickname", "name_color", "description", "avatar"])
    .limit(limit ?? DEFAULT_LIMIT)
    .orderBy("created_at", "desc")
    .execute()

  return query;
}

const getLatestRegUsersSchema = z.object({
  limit: z.string().transform(Number).optional(),
})

const encoder = new Encoder({ useRecords: false, structures: [], pack: true });

export const getLatestRegUsersRoute = new Hono()
  .get("/get-latest-reg-users", zValidator("query", getLatestRegUsersSchema), async (ctx) => {
    const { limit } = getLatestRegUsersSchema.parse(ctx.req.query());

    try {
      const users = await getLatestRegUsers({ limit });

      if (!users || !users.length) {
        return ctx.json({ data: null }, 200)
      }

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