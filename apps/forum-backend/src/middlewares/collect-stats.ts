import { publishStats } from "#publishers/pub-collect-stats.ts";
import { getUserNicknameByTokenFromKv } from "#utils/get-user-by-token-from-kv.ts";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const collectStats = () => createMiddleware(async (ctx, next) => {
  const userAgent = ctx.req.header("User-Agent")
  const isSuspicious = !userAgent || userAgent.startsWith('curl/') || userAgent.startsWith('Wget');

  if (isSuspicious) {
    return ctx.json({ error: "Ignoring request from suspicious" }, 401)
  }

  const sessionToken = getCookie(ctx, "session")
  const nickname = await getUserNicknameByTokenFromKv(sessionToken)

  if (nickname) {
    publishStats({ initiator: nickname, ip: null })
  } else {
    const forwardedFor = ctx.req.header("x-forwarded-for")
    const realIp = ctx.req.header("x-real-ip")

    if (!forwardedFor && !realIp) {
      return ctx.json({ error: "Ignoring request from suspicious" }, 402)
    }

    if (forwardedFor) {
      publishStats({ ip: forwardedFor, initiator: null })
    } else if (realIp) {
      publishStats({ ip: realIp, initiator: null})
    }
  }

  await next()
})