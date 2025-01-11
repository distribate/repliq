"use server";

import "server-only";
import { z } from "zod";
import { headers, cookies } from "next/headers";
import { authClient } from "@repo/shared/api/auth-client.ts";
import { redirect } from "next/navigation";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { createSessionBodySchema } from '@repo/types/schemas/auth/create-session-schema.ts';

type CreateSession = z.infer<typeof createSessionBodySchema>;

async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  cookies().set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

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

  const expiresAt = new Date(createdSession.data.expiresAt);

  await setSessionTokenCookie(createdSession.data.token, expiresAt);

  return redirect(USER_URL + nickname);
}