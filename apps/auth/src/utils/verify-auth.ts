import { logger } from "@repo/shared/utils/logger.ts";
import ky from "ky"

type Payload = {
  success: boolean,
  messages: Array<unknown>,
  challenge_ts: Date,
  action: string,
  cdata: string,
  tokenId: string
}

export async function verifyAuth(token: string) {
  try {
    const verifyRes = await ky.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      json: { secret: Bun.env.CF_TURNSTILE_TOKEN, response: token },
    });

    if (!verifyRes.ok) {
      return "no-verified"
    }

    const result = await verifyRes.json<Payload>();

    if (!result.success) return "no-verified"

    return "verified"
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
    }

    return "no-verified"
  }
}