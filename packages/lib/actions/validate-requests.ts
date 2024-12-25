"use server";

import { cookies } from "next/headers";
import { validateSessionToken } from "#actions/session-token-control.ts";
import { redirect } from "next/navigation";

export async function validateSession() {
  const token = cookies().get("session")?.value ?? null;

  if (token === null) {
    return new Response(null, { status: 401 });
  }

  try {
    const res = await validateSessionToken(token);
    const session = await res.json();

    if ("error" in session) {
      console.error(session?.error)
      throw new Error(session.error);
    }
  
    return session;
  } catch (e) {
    redirect("/not-online")
  }
}