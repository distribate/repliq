import "server-only";

import { cookies } from "next/headers";
import { authClient } from "#utils/api/auth-client.ts";

export async function validateSessionToken(token: string) {
  return await authClient["validate-session"].$post({
    json: { token },
  });
}

export async function setSessionTokenCookie(
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

export async function deleteSessionTokenCookie(): Promise<void> {
  cookies().set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
