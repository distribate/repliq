import { createWebsocketToken } from "#lib/queries/ws/create-websocket-token.ts"
import { WEBSOCKET_TOKEN_LENGTH } from "#shared/constants/websockets.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { throwError } from "@repo/lib/helpers/throw-error"
import { Hono } from "hono"
import { nanoid } from "nanoid"

export const confirmWebsocketConnRoute = new Hono()
  .get("/confirm-websocket-conn", async (ctx) => {
    const nickname = getNickname()

    const token = nanoid(WEBSOCKET_TOKEN_LENGTH);

    try {
      const createdToken = await createWebsocketToken(nickname, token)

      if (!createdToken) {
        return ctx.json({ error: "Error creating token" }, 400);
      }

      return ctx.json({ token: token, for: nickname }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })