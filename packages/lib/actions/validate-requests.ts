'use server';

import { cookies } from 'next/headers';
import { authClient } from 'authorization';

export async function validateSessionToken(token: string) {
  const res = await authClient.auth["validate-session"].$post({
    json: { token }
  })
  
  const data = await res.json()
  
  if ("error" in data) {
    throw new Error(data.error)
  }
  
  return data
}

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