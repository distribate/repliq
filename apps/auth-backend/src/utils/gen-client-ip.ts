import type { Context } from "hono";
import { getConnInfo } from "hono/bun";
import { convertIPv6ToIPv4 } from "../helpers/ipv6-to-ipv4";

const FALLBACK_IP = "0.0.0.0"

export function getClientIp(ctx: Context): string {
  const forwarded = ctx.req.header("x-forwarded-for");

  if (!forwarded) {
    const connInfo = getConnInfo(ctx);

    if (!connInfo.remote.address) {
      return FALLBACK_IP;
    }

    return convertIPv6ToIPv4(connInfo.remote.address) ?? FALLBACK_IP;
  }

  return forwarded ?? FALLBACK_IP;
}