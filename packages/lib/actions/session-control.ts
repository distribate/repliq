import "server-only"

import { cookies } from "next/headers"
import { getCurrentSession } from '#actions/get-current-session.ts';
import { authClient } from 'authorization/src';

export async function setSessionTokenCookie(
  token: string, expiresAt: Date
): Promise<void> {
  cookies().set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const currentSession = await getCurrentSession();
  const cookieStore = cookies();
  
  if (!currentSession.session) {
    throw new Error("Session not defined")
  }
  
  const res = await authClient.auth["invalidate-session"].$post({
    json: { sessionId: currentSession.session.session_id }
  })
  
  const data = await res.json()
  
  if ("error" in data) {
    throw new Error(data.error)
  }
  
  if (!data.success) {
    throw new Error("Something went wrong")
  }
  
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
}