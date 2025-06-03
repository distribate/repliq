import { isProduction } from "@repo/lib/helpers/is-production"
import type { Context } from "hono"
import { verifyAuth } from "../../utils/verify-auth"
import { getClientIp } from "../../utils/gen-client-ip"
import { validateIpRestricts } from "../../utils/validate-ip-restricts"

type ValidateAuthenticationRequest = {
  ctx: Context, 
  token?: string | null
}

export const validateAuthenticationRequest = async ({ ctx, token }: ValidateAuthenticationRequest) => {
  if (isProduction && !token) {
    return ctx.json({ error: "Token is not provided" }, 400)
  }

  const isVerified = await verifyAuth(token!)

  if (isVerified !== "verified") {
    return ctx.json({ error: "Invalid token" }, 400)
  }

  const ip = getClientIp(ctx)

  if (!ip) {
    return ctx.json({ error: "IP is not provided" }, 400)
  }

  const isValid = await validateIpRestricts(ip)

  if (isValid) {
    return ctx.json({ error: "IP already exists" }, 400)
  }
}