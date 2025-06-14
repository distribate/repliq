import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min;

export const getFactRoute = new Hono()
  .get("/get-fact", async (ctx) => {
    const randomId = Math.floor(getRandomArbitrary(1, 97));

    try {
      const fact = await sqliteDB
        .selectFrom("minecraft_facts")
        .select("fact")
        .where("id", "=", randomId)
        .executeTakeFirst();

      if (!fact) {
        return ctx.json({ data: null }, 200);
      }

      return ctx.json({ data: fact.fact }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })