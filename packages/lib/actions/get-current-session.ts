"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { validateSessionToken } from "#actions/session-token-control.ts";
import { redirect } from "next/navigation";
import type { Session, User } from 'auth-backend/src/routes/create-session.ts';

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = cookies().get("session")?.value ?? null;

    if (token === null) {
      return { session: null, user: null };
    }

    try {
      const res = await validateSessionToken(token);

      const data = await res.json();
  
      if ("error" in data) {
        console.error(data?.error)
        throw new Error(data.error);
      }
    
      const { session, user } = data;
  
      if (!session || !user) {
        return { session: null, user: null };
      }
  
      return { session, user };
    } catch (e) {
      redirect("/not-online")
    }
  },
);
