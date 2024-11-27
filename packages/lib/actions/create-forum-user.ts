'use server';

import 'server-only';
import ky, { HTTPError } from 'ky';
import type { UserDetails } from 'authorization/lib/routes/create-user.ts';
import { authorized } from '#helpers/authorize-req.ts';

export async function createForumUser({
  nickname, password, realName, findout
}: UserDetails) {
  try {
    const res = await ky.post('http://localhost:3400/auth/register', {
      headers: {
        ...authorized.headers,
        "Content-Type": "application/json"
      },
      json: { nickname, password, realName, findout },
    });
    
    return { error: null, status: res.status }
  } catch (e) {
    if (e instanceof HTTPError) {
      const isJson = e.response.headers
      ?.get('content-type')
      ?.includes('application/json');
      
      const errorData = isJson
        ? await e.response.json()
        : await e.response.text();
      
      return {
        status: e.response.status,
        error: isJson ? errorData.message : errorData,
      };
    }
    
    return { status: 500, error: 'Internal Server Error', };
  }
}