import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Kvm } from "@nats-io/kv";

export async function getUserNicknameByToken(token: string) {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  const kv = await kvm.open("users");

  const entry = await kv.get(token);

  if (!entry) return false;

  return { nickname: entry.string() };
}

export async function watcher() {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  // const kv = await kvm.create("users", { ttl: 30 * 24 * 60 * 60 * 1000 });
  const kv = await kvm.open("users");

  const watch = await kv.watch();

  (async () => {
    for await (const e of watch) {
      console.log(
        `watch: ${e.key}: ${e.operation} ${e.value ? e.string() : ""}`,
      );
    }
  })().then();
}

export const validateRequest = createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, "session")

  if (!sessionToken) {
    return ctx.json({ error: "Unauthorized" }, 401)
  }

  const nickname = await getUserNicknameByToken(sessionToken)

  if (!nickname) {
    return ctx.json({ error: "Unauthrozied" }, 401)
  }

  ctx.set('nickname', nickname.nickname);

  await next()
})