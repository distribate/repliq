"use server";

import { redirect } from "next/navigation";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { getCurrentSession } from "#actions/get-current-session.ts";
import { authClient } from "@repo/shared/api/auth-client.ts";
import { cookies } from "next/headers";

async function deleteSessionTokenCookie(): Promise<void> {
  cookies().set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const { session } = await getCurrentSession();

  if (!session) {
    await deleteSessionTokenCookie();
    redirect(AUTH_REDIRECT);
  }

  const res = await authClient["invalidate-session"].$post({
    json: { sessionId: session.session_id },
  });

  const data = await res.json();

  if ("error" in data) {
    throw new Error(data.error);
  }

  if (!data.success) {
    return
  }

  await deleteSessionTokenCookie();
  return redirect(AUTH_REDIRECT);
}