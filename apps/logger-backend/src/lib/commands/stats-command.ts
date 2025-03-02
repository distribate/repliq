import { getNatsConnection } from "@repo/config-nats/nats-client";
import { loggerBot } from "../../shared/bot/bot";
import { SERVER_EVENT_GET_SERVER_STATS, SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { format } from "gramio";

type StatusPayload = {
  maxPlayers: number,
  players: Array<string>,
  tps: Array<number>,
  currentOnline: number,
  mspt: number
}

loggerBot.command("stats", async (ctx) => {
  const nc = getNatsConnection()

  const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify({
    event: SERVER_EVENT_GET_SERVER_STATS
  }))

  const data = res.json<StatusPayload | { error: string }>()

  if ("error" in data) {
    return ctx.reply(data.error)
  }

  const message = format`
  Сервер: Bisquite
    Текущий онлайн: ${data.currentOnline}/${data.maxPlayers}
    Игроки: ${data.players.join(", ")}
    ТПС: ${data.tps.map(t => t.toFixed(2)).join(", ")}
    МСПТ: ${data.mspt.toFixed(2)}
  `

  await ctx.reply(message);
});