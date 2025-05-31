import { logger } from "@repo/lib/utils/logger";
import ky from "ky"

const CLOUDFLARE_TURNSTILE_SECRET_KEY = "0x4AAAAAAA-stfzoKM9_11nOW5V0dd54VS0"

export async function verifyAuth(token: string) {
  const verifyRes = await ky.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    json: { secret: CLOUDFLARE_TURNSTILE_SECRET_KEY, response: token },
  });

  if (!verifyRes.ok) {
    return "no-verified"
  }

  const result = await verifyRes.json();

  logger.debug(result)

  return "verified"
}