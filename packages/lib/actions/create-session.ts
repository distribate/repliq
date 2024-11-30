'use server';

import 'server-only';
import { redirect } from 'next/navigation';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { setSessionTokenCookie } from '#actions/session-control.ts';
import { authClient } from 'authorization/src';
import { createSessionBodySchema } from 'authorization/src/lib/routes/create-session.ts';
import { z } from 'zod';
import { userAgent } from 'next/server';
import { headers } from 'next/headers';

type CreateSession = z.infer<typeof createSessionBodySchema>

async function createSession({
  details, info,
}: CreateSession) {
  const res = await authClient.auth['create-session'].$post({
    json: { details, info },
  });
  
  return await res.json();
}

export async function createSessionAction({
  details
}: Pick<CreateSession, "details">) {
  const ua = headers().get("Sec-CH-UA")
  const headersObject: Record<string, string> = {};
  const allHeaders = headers();

  for (const [key, value] of allHeaders) {
    headersObject[key] = value;
  }

  console.log(ua, headersObject);
  
  // const createdSession = await createSession({
  //   details,
  //   info: { browser: null, ua: null, ip: null, cpu: null, os: null, isBot: false },
  // });
  //
  // if ("error" in createdSession) {
  //   return { error: createdSession.error };
  // }
  //
  // const expiresAt = new Date(createdSession.expiresAt);
  //
  // await setSessionTokenCookie(createdSession.token, expiresAt);
  //
  // return redirect(USER_URL + details.nickname);
}