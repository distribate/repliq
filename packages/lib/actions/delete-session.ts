"use server";

import { redirect } from "next/navigation";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { getCurrentSession } from "#actions/get-current-session.ts";
import { deleteSessionTokenCookie } from "#actions/session-token-control.ts";
import { authClient } from "@repo/shared/api/auth-client.ts";

export async function deleteSession(): Promise<void> {
  const { session } = await getCurrentSession();

  if (!session) {
    throw new Error("Session not defined");
  }

  const res = await authClient["invalidate-session"].$post({
    json: { sessionId: session.session_id },
  });

  const data = await res.json();

  if ("error" in data) {
    throw new Error(data.error);
  }

  if (!data.success) {
    throw new Error("Something went wrong");
  }

  await deleteSessionTokenCookie();

  return redirect(AUTH_REDIRECT);
}
