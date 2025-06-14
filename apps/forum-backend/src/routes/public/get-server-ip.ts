import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getServerIp() {
  const query = await sqliteDB
    .selectFrom("ip_list")
    .select("ip")
    .where("name", "=", "server_proxy")
    .executeTakeFirst()

  return query;
}

export const getServerIpRoute = new Hono()
  .get("/get-server-ip", async (ctx) => {
    try {
      const serverIp = await getServerIp()

      ctx.header("Cache-Control", "public, max=age=600")

      return ctx.json({ data: serverIp }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })