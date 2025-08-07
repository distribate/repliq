import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getAlertsSchema } from "@repo/types/schemas/alerts/get-alerts-schema.ts";
import * as z from "zod"
import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { forumDB } from "#shared/database/forum-db.ts";

const DEFAULT_LIMIT = 1

type Alert = {
  id: number,
  creator: {
    nickname: string,
    avatar: string | null
  }
  created_at: string | Date,
  title: string,
  link: string | null,
  description: string | null
}

const getAlerts = async ({ cursor, limit = DEFAULT_LIMIT }: z.infer<typeof getAlertsSchema>) => {
  const query = await sqliteDB
    .selectFrom("alerts")
    .selectAll()
    .limit(limit)
    .execute()

  let data: Array<Alert> | [] = [];

  if (query.length > 0) {
    const creatorNicknames = [...new Set(query.map(alert => alert.creator))];

    const users = await forumDB
      .selectFrom("users")
      .select(["nickname", "avatar"])
      .where("users.nickname", "in", creatorNicknames)
      .execute();

    const usersByNickname = new Map(users.map(user => [user.nickname, user]));

    const alertsWithAvatars = query.map(alert => {
      const user = usersByNickname.get(alert.creator);

      return {
        ...alert,
        id: Number(alert.id),
        creator: {
          nickname: user?.nickname!,
          avatar: user?.avatar ?? null
        },
        link: null
      };
    });

    data = alertsWithAvatars; 
  }

  return {
    data,
    meta: {
      hasNextPage: false,
      endCursor: undefined,
      startCursor: undefined,
      hasPrevPage: false
    }
  }
}

export const getAlertsRoute = new Hono()
  .get("/get-alerts", zValidator("query", getAlertsSchema), async (ctx) => {
    const { cursor, limit } = getAlertsSchema.parse(ctx.req.query())

    try {
      const alerts = await getAlerts({ cursor, limit })

      return ctx.json(alerts, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })