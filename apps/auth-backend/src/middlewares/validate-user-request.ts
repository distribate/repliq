import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { forumDB } from "../shared/database/forum-db";
import { SESSION_KEY } from "../shared/constants/session-details";

export async function getUserSession(sessionId: string) {
  return forumDB
    .selectFrom("users_session")
    .select("nickname")
    .where("session_id", "=", sessionId)
    .executeTakeFirst();
}

type ValidateUserRequest = {
  withValidation?: boolean
}

export const validateUserRequest = ({
  withValidation = true,
}: ValidateUserRequest = {}) => createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, SESSION_KEY);

  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken))
  );

  const session = await getUserSession(sessionId)

  if (withValidation && !session) {
    return ctx.json({ error: "Unauthorized" }, 200)
  }

  ctx.set('sessionToken', sessionToken)
  ctx.set('currentSessionId', sessionId)
  ctx.set('nickname', session?.nickname)

  await next()
})