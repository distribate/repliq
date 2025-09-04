import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sqliteDB } from "#shared/database/sqlite-db.ts";

type Alert = {
  id: number,
  created_at: string,
  title: string,
  description: string | null,
  creator: string
}

const getAlerts = async () => {
  const query = await sqliteDB
    .selectFrom("alerts")
    .select([
      "alerts.id",
      "alerts.created_at",
      "alerts.title",
      "alerts.description",
      "alerts.creator",
    ])
    .limit(1)
    .orderBy("alerts.created_at", "desc")
    .$castTo<Alert>()
    .executeTakeFirst()

  return query ?? null
}

export const getAlertRoute = new Hono()
  .get("/get-alert", async (ctx) => {
    try {
      const data = await getAlerts()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })