'use server';

import { cookies } from 'next/headers';
import { validateSessionToken } from '#actions/session-token-control.ts';

export async function validateSession() {
  const token = cookies().get("session")?.value ?? null;
  
  if (token === null) {
    return new Response(null, { status: 401 });
  }
  
  const session = await validateSessionToken(token);
  
  if (session === null) {
    return new Response(null, { status: 401 });
  }
}