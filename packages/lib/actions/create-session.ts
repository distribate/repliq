"use server";

import "server-only";
import { z } from "zod";
import { headers } from "next/headers";
import { authClient } from "@repo/shared/api/auth-client.ts";
import { setSessionTokenCookie } from "#actions/session-token-control.ts";
import { redirect } from "next/navigation";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { createSessionBodySchema } from '@repo/types/schemas/auth/create-session-schema.ts';

type CreateSession = z.infer<typeof createSessionBodySchema>;

async function createSession({ details, info }: CreateSession) {
  const res = await authClient["create-session"].$post({
    json: { details, info },
  });

  return await res.json();
}

export async function createSessionAction({
  nickname,
  password,
}: Pick<CreateSession, "details">["details"]) {
  const ua = headers().get("Sec-CH-UA");

  const createdSession = await createSession({
    details: { nickname, password },
    info: {
      browser: null,
      ua: null,
      ip: null,
      cpu: null,
      os: null,
      isBot: false,
    },
  });

  if ("error" in createdSession) {
    return { error: createdSession.error };
  }

  const expiresAt = new Date(createdSession.expiresAt);

  await setSessionTokenCookie(createdSession.token, expiresAt);

  return redirect(USER_URL + nickname);
}
