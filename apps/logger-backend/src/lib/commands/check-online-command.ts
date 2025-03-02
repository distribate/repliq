import { getNatsConnection } from "@repo/config-nats/nats-client";
import { loggerBot } from "../../shared/bot/bot";
import { SERVER_EVENT_CHECK_PLAYER_STATUS, SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { bold, format } from "gramio";

loggerBot.command("check", async (ctx) => {
  if (!ctx.args) {
    return ctx.reply('Укажите ник игрока')
  }

  const nc = getNatsConnection()

  const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify({
    event: SERVER_EVENT_CHECK_PLAYER_STATUS,
    nickname: ctx.args[0]
  }))

  const data = res.json<{ nickname: string, type: "online" | "offline" } | { error: string }>()

  if ("error" in data) {
    return ctx.reply(data.error)
  }

  const message = format`
    Игрок ${data.nickname} сейчас ${bold(data.type)}
  `

  await ctx.reply(message);
});