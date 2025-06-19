import { getNatsConnection } from "@repo/config-nats/nats-client";
import { SERVER_EVENT_GET_SERVER_STATS, SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { Bot, format } from "gramio";
import { validateRequest } from "../../utils/validate-request";

type StatusPayload = {
  maxPlayers: number,
  players: Array<string>,
  tps: Array<number>,
  currentOnline: number,
  mspt: number
}

export function statsCommand(bot: Bot) {
  bot.command("stats", async (ctx) => {
    if (!ctx.from) {
      return
    }
  
    if (ctx.chat.id !== -1002049549066) {
      const userId = ctx.from.id
      const isAdmin = await validateRequest(userId);
  
      if (!isAdmin) {
        return ctx.reply('У вас нет доступа к этой команде');
      }
    }
  
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
}
