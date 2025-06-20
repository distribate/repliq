import type { Context } from "hono";
import { convertIPv6ToIPv4 } from "../helpers/ipv6-to-ipv4";

export function getClientIp(ctx: Context): string | null {
  const forwarded = ctx.req.header("x-forwarded-for");

  if (!forwarded) {
    const realIp = ctx.req.header("x-real-ip")

    if (!realIp) {
      return null;
    }

    return convertIPv6ToIPv4(realIp);
  }

  return forwarded;
}