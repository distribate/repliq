import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Hono } from "hono";

type PlayerStatus = {
  nickname: string;
  type: "online" | "offline"
}

async function getUserIssueLoginTime(nickname: string) {
  return await forumDB
  .selectFrom("users_game_status")
  .select(["quited", "joined"])
  .where("nickname", "=", nickname)
  .executeTakeFirst()
}

async function getPlayerStatus(nickname: string) {
  const nc = getNatsConnection();

  try {
    const response = await nc.request("server.user.status", JSON.stringify({ nickname }));
    const status = response.json<PlayerStatus>();
    const issueLoginTime = await getUserIssueLoginTime(nickname);

    if (!issueLoginTime) {
      return { ...status, issued_date: null }
    }

    return {
      ...status,
      issued_date: issueLoginTime[status.type === "online" ? "joined" : "quited"]
    }
  } catch (e) {
    throwError(e)
  }
}

export const getUserGameStatusRoute = new Hono()
  .get("/get-user-game-status/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const payload = await getPlayerStatus(nickname);

      if (!payload) {
        return ctx.json({ error: "No response from server or player not found" }, 404);
      }

      return ctx.json(payload, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)