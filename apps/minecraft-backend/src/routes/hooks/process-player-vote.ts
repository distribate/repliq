import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";
import { publishVoteNotify } from "#publishers/pub-vote-notify.ts";
import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { sqliteDB } from "#shared/database/sqlite-db.ts";

async function postVoted(nickname: string) {
  const result = await sqliteDB
    .insertInto("voted_users")
    .values({ nickname })
    .onConflict((ob) => ob.column("nickname").doNothing())
    .execute();

  if (Number(result[0].numInsertedOrUpdatedRows) === 0) {
    return
  }

  const { reward } = await sqliteDB
    .selectFrom("events")
    .select("reward")
    .where("origin", "=", "vote-for-server")
    .executeTakeFirstOrThrow()

  const addCharism = await bisquiteDB
    .updateTable("CMI_users")
    .set({
      Balance: sql`Balance + ${Number(reward)}`
    })
    .where("username", "=", nickname)
    .executeTakeFirstOrThrow()

  if (Number(addCharism.numUpdatedRows) === 0) {
    return
  }

  publishVoteNotify(nickname)

  return
}

export const processPlayerVoteRoute = new Hono()
  .post("/process-player-vote", async (ctx) => {
    const parsedBody = await ctx.req.parseBody()

    const nick = parsedBody["nick"] as string;
    const time = parsedBody["time"] as string;
    const sign = parsedBody["sign"] as string;

    if (!nick || !time || !sign) {
      return ctx.text('error', 400);
    }

    if (nick.length > 16) {
      return ctx.text('nickname limit', 400);
    }

    const expSign = new Bun.CryptoHasher("sha1")
      .update(nick + time + Bun.env.VOTIFIEF_SECRET_KEY)
      .digest('hex');

    if (sign !== expSign) {
      return ctx.text('error', 400);
    }

    await postVoted(nick);

    return ctx.text('ok', 200);
  })