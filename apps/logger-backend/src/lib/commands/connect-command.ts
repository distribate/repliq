import { Kvm } from '@nats-io/kv';
import { getNatsConnection } from '@repo/config-nats/nats-client';
import { forumDB } from '../../shared/database/forum-db';
import { bold, Bot, format } from 'gramio';
import { CONNECT_SOCIAL_SUBJECT } from "@repo/shared/constants/nats-subjects"

async function connectUser(userId: number, nickname: string) {
  const query = await forumDB
    .insertInto("users_connections")
    .values({ nickname, type: "telegram", value: userId.toString() })
    .executeTakeFirst()

  return query.numInsertedOrUpdatedRows ? query.numInsertedOrUpdatedRows > 0 : false
}

type ConnectServicePayload = {
  service: string,
  nickname: string,
  status: "success" | "error"
}

export function connectUserCommand(bot: Bot) {
  bot.command("connect", async (ctx) => {
    if (!ctx.from) return

    const userId = ctx.from.id
    const token = ctx.args

    if (!token) return ctx.reply('Укажите токен')
  
    const nc = getNatsConnection()
    const kvm = new Kvm(nc)
    const kv = await kvm.open("connect_tokens")

    const existsToken = await kv.get(`token-${token}`);

    if (!existsToken) {
      return await ctx.reply("Токен недействителен")
    }

    const payload = existsToken.json<Omit<ConnectServicePayload, "status">>()

    const result = await connectUser(userId, payload.nickname)

    if (!result) {
      const data = JSON.stringify({ ...payload, status: "error" })

      nc.publish(CONNECT_SOCIAL_SUBJECT, data)
      return ctx.reply("Error")
    }

    const data = JSON.stringify({ ...payload, status: "success" })

    nc.publish(CONNECT_SOCIAL_SUBJECT, data)

    const text = format`🐈‍⬛ ྀི Ваш аккаунт теперь привязан к пользователю ${bold(payload.nickname)}!`

    await ctx.reply(text)
  })
}