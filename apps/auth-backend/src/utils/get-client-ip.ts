import type { Context } from "hono";
import { convertIPv6ToIPv4 } from "../helpers/ipv6-to-ipv4";

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