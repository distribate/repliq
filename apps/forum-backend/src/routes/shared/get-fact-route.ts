import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min;

export const getFactRoute = new Hono()
  .get("/get-fact", async (ctx) => {
    const randomId = Math.floor(getRandomArbitrary(1, 97));

    try {
      const fact = await forumDB
        .selectFrom("config_minecraft_facts")
        .select("fact")
        // @ts-ignore
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