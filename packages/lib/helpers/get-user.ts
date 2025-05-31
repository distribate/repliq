import { reatomAsync, reatomResource, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { atom, Ctx, CtxSpy } from '@reatom/core';
import { redirect } from "@tanstack/react-router";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes";
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import ky, { HTTPError } from 'ky';
import { decode } from 'cbor-x';

export const currentUserNicknameAtom = atom<string | null>(null, "currentUserNickname")
export const currentUserAtom = atom<UserDetailed | null>(null, "currentUser")

export async function getUserInformation(): Promise<UserDetailed> {
  const url = forumUserClient.user["get-me"].$url()

  try {
    const res = await ky.get(url, { credentials: "include" })

    const encodedData = await res.arrayBuffer()
    const uint8Data = new Uint8Array(encodedData);

    const data: { data: UserDetailed } | { error: string } = decode(uint8Data);

    if ("error" in data) {
      throw new Error("Failed user information")
    }

    return data.data
  } catch (e) {
    if (e instanceof HTTPError) {
      const body = await e.response.json()

      if (body.status === "You are banned") {
        throw redirect({
          to: `/banned?reason=${body.data.reason}&time=${body.data.time}&created_at=${body.data.created_at}`
        })
      }
    }

    throw e
  }
}

export const currentUserResource = reatomResource(async (ctx) => {
  const existingUser = ctx.get(currentUserAtom); 

  if (existingUser) {
    return existingUser; 
  }

  const freshUser = await ctx.schedule(() => getUserInformation());
  
  return freshUser; 
}, "currentUserResource").pipe(
  withStatusesAtom(),
  withErrorAtom((ctx, error) => {
    if (error) {
      return redirect({ to: AUTH_REDIRECT }); 
    }

    return error; 
  }),
)

currentUserResource.onFulfill.onCall((ctx, res) => {
  if (res) {
    const currentUser = ctx.get(currentUserAtom);

    if (!currentUser || currentUser.id !== res.id) {
      currentUserNicknameAtom(ctx, res.nickname);
      currentUserAtom(ctx, res);
    }

    const isInited = ctx.get(userGlobalOptionsAtomIsInitAtom)
    
    if (!isInited) {
      userGlobalOptionsAction(ctx); 
    }
  }
})

export const getUser = (ctx: CtxSpy | Ctx) => {
  let user: UserDetailed | null = null;

  if (ctx.spy) {
    user = ctx.spy(currentUserAtom)
  } else {
    user = ctx.get(currentUserAtom)
  }

  if (!user) {
    // todo: implement redirect
    throw new Error("User not defined")
  }

  return user;
}

async function getUserGlobalOptions() {
  const res = await forumUserClient.user["get-user-global-options"].$get()
  const data = await res.json()

  if (!data || "error" in data) return null;

  return data.data;
}

const initial = {
  is_admin: false,
  can_create_threads: false,
  can_create_comments: false,
  can_create_posts: false,
  has_new_notifications: false,
  has_new_friends: false,
  has_new_events: false,
}

const userGlobalOptionsAtomIsInitAtom = atom(false, "userGlobalOptionsAtomIs")
export const userGlobalOptionsAtom = atom<typeof initial>(initial, "userGlobalOptions")

export const userGlobalOptionsAction = reatomAsync(async (ctx) => {  
  return await ctx.schedule(() => getUserGlobalOptions())
}, {
  name: "userGlobalOptionsAction",
  onFulfill: (ctx, res) => {
    if (res) {
      userGlobalOptionsAtomIsInitAtom(ctx, true)
      userGlobalOptionsAtom(ctx, res)
    }
  }
})