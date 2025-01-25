import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserLastVisitTime } from "#lib/queries/user/get-user-last-visit-time.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Hono } from "hono";

type PlayerStatus = {
  nickname: string;
  type: "online" | "offline"
}

async function getPlayerStatus(nickname: string) {
  const nc = getNatsConnection();

  const lastVisitTime = await getUserLastVisitTime(nickname);

  let response;

  try {
    response = await nc.request("server.user.status", JSON.stringify({ nickname }));
  } catch (e) {
    console.error(`No responders for server.user.status`);
  }

  if (response) {
    const status = response.json<PlayerStatus>();

    if (!lastVisitTime) {
      return { ...status, issued_date: null }
    }

    let statusType: "joined" | "quited" = "quited";

    if (status.type) {
      statusType = status.type === "online" ? "joined" : "quited";
    }

    return { ...status, issued_date: lastVisitTime[statusType] }
  } else {
    return { nickname, type: "offline", issued_date: lastVisitTime?.quited }
  }
}

export const getUserGameStatusRoute = new Hono()
  .get("/get-user-game-status/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const payload = await getPlayerStatus(nickname);

      return ctx.json({ data: payload }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )