"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session, User } from 'auth-backend/src/routes/create-session.ts';
import { authClient } from "@repo/shared/api/auth-client";

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export async function validateSessionToken(token: string) {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const res = await authClient["validate-session"].$post({
      json: { token },
    });

    return await res.json()
  } catch (e) {
    console.error(e)
    throw new Error("Failed to validate session token");
  }
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
  const token = cookies().get("session")?.value ?? null;

  if (token === null) {
    return { session: null, user: null };
  }

  try {
    const data = await validateSessionToken(token);

    if (!data || "error" in data) {
      redirect("/not-online")
    }

    const { session, user } = data;

    if (!session || !user) {
      return { session: null, user: null };
    }

    return { session, user };
  } catch (e) {
    redirect("/not-online")
  }
});