import { Kvm } from '@nats-io/kv';
import { getNatsConnection } from '@repo/config-nats/nats-client';
import { fasberryBot } from './../../shared/bot/bot';
import { forumDB } from '../../shared/database/forum-db';

async function connectUser(userId: number, nickname: string) {
  const query = await forumDB
    .insertInto("users_connections")
    .values({ nickname, type: "telegram", value: userId.toString() })
    .executeTakeFirst()

  return query.numInsertedOrUpdatedRows ? query.numInsertedOrUpdatedRows > 0 : false
}

fasberryBot.command("connect", async (ctx) => {
  if (!ctx.from) return

  const userId = ctx.from.id

  if (!ctx.args) {
    return ctx.reply('Укажите токен')
  }

  const token = ctx.args

  const nc = getNatsConnection()
  const kvm = new Kvm(nc)
  const kv = await kvm.open("connect_tokens")

  const existsToken = await kv.get(`token-${token}`);

  if (!existsToken) {
    return await ctx.reply("not ok")
  }

  const payload = existsToken.json<{ type: string, nickname: string }>()

  await connectUser(userId, payload.nickname)

  const text = `Ваш аккаунт теперь привязан к ${payload.nickname}!`

  await ctx.reply(text)
})