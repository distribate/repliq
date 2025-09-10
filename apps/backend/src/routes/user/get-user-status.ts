import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { getUserActivityStatus, ONLINE_USERS_TIME } from "#lib/modules/user-activity-status.ts";

async function getActivity(nickname: string) {
  const ts: number | null = await getUserActivityStatus(nickname);

  let status: "online" | "offline" = "offline";
  let payload: Date | null = null;

  if (ts !== null) {
    payload = new Date(ts);

    if (Date.now() - ts < ONLINE_USERS_TIME) {
      status = "online";
    }
  }

  return { payload, status };
}

export const getUserActivityStatusRoute = new Hono()
  .get("/user-activity-status/:nickname", async (ctx) => {
    const nickname = ctx.req.param("nickname")

    try {
      const data = await getActivity(nickname)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })