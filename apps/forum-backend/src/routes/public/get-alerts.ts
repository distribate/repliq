import { getAlerts } from "#lib/queries/public/get-alerts.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getAlertsSchema } from "@repo/types/schemas/alerts/get-alerts-schema.ts";

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