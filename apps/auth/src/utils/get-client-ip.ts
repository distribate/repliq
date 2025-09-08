import type { Context } from "hono";

const REGEXP = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/

function v6Tov4(v6: string): string | null {
  const match = v6.match(REGEXP);
  return match ? match[1] : null;
}

export function getClientIp(ctx: Context): string | null {
  let ip: string | null = null;

  const forwarded = ctx.req.header("x-forwarded-for");

  if (!forwarded) {
    const realIp = ctx.req.header("x-real-ip")

    if (realIp) {
      ip = v6Tov4(realIp);
    }
  } else {
    ip = forwarded
  }

  if (!ip) {
    if (ctx.req.header("referer")?.includes("localhost")) {
      ip = "0.0.0.0"
    }
  }

  return ip;
}