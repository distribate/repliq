import type { Context } from "hono";
import { getConnInfo } from "hono/bun";
import { convertIPv6ToIPv4 } from "../helpers/ipv6-to-ipv4";

export function getClientIp(ctx: Context) {
  const forwarded = ctx.req.header("x-forwarded-for");

  if (!forwarded) {
    const connInfo = getConnInfo(ctx);

    if (!connInfo.remote.address) {
      return null;
    }

    return convertIPv6ToIPv4(connInfo.remote.address);
  }

  return forwarded
}