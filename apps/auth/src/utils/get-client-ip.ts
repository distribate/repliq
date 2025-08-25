import type { Context } from "hono";

function convertIPv6ToIPv4(ipv6: string): string | null {
  const match = ipv6.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  return match ? match[1] : null;
}

export function getClientIp(ctx: Context): string | null {
  let ip: string | null = null;

  const forwarded = ctx.req.header("x-forwarded-for");

  if (!forwarded) {
    const realIp = ctx.req.header("x-real-ip")

    if (realIp) {
      ip = convertIPv6ToIPv4(realIp);
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