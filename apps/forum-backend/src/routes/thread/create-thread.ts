import { throwError } from "#helpers/throw-error.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

export const createThreadRoute = new Hono()
  .post("/create-thread", async (ctx) => {

    const nickname = getNickname()

    try {

    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)