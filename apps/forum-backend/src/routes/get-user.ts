import { Hono } from "hono";
import { forumDB, lpDB } from "#lib/db/db.ts";
import { HTTPException } from "hono/http-exception";
import { jsonObjectFrom } from "kysely/helpers/postgres";

type UserPreferences = {
  coverOutline: boolean;
  friendRequest: boolean;
  realNameVisibility: boolean;
  gameStatsVisibility: boolean;
};

async function getUserByNickname(nickname: string) {
  let user = await forumDB
    .selectFrom("users")
    .where("nickname", "=", nickname)
    .selectAll()
    .executeTakeFirst();

  if (!user) return null;

  let donate = await lpDB
    .selectFrom("luckperms_players")
    .where("username", "=", nickname)
    .select("primary_group")
    .executeTakeFirst();

  if (!donate) return null;

  return {
    ...user,
    donate: donate.primary_group,
  };
}

export const getUserRoute = new Hono().get("/get-user/:nickname", async (c) => {
  const { nickname } = c.req.param();

  if (!nickname) {
    throw new HTTPException(400, { message: "Invalid param" });
  }

  return c.json(await getUserByNickname(nickname), 200);
});
