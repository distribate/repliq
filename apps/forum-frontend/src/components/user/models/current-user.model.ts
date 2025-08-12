import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import { atom, Ctx, CtxSpy } from '@reatom/core';
import { forumUserClient } from '#shared/forum-client.ts';
import { withSsr } from '#lib/ssr';
import { withInit } from '@reatom/framework';

export const currentUserNicknameAtom = atom<string | null>(null, "currentUserNickname").pipe(
  withInit((ctx, _) => ctx.get(currentUserAtom)?.nickname ?? null)
)

export const CURRENT_USER_ATOM_KEY = "currentUserAtom"

export const currentUserAtom = atom<UserDetailed | null>(null, "currentUser").pipe(
  withSsr(CURRENT_USER_ATOM_KEY)
)

export const userGlobalOptionsInitial = {
  is_admin: false,
  can_create_threads: false,
  can_create_comments: false,
  can_create_posts: false,
  can_create_issue: false,
  has_new_notifications: false,
  has_new_friends: false,
}

export const USER_GLOBAL_OPTIONS_KEY = "userGlobalOptionsAtom"

export const userGlobalOptionsAtom = atom<typeof userGlobalOptionsInitial>(userGlobalOptionsInitial, "userGlobalOptions").pipe(
  withSsr(USER_GLOBAL_OPTIONS_KEY)
)

export async function getUserInformation(
  init?: RequestInit
): Promise<UserDetailed> {
  const res = await forumUserClient.user["get-me"].$get({}, { init })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.data
}

export const getUser = (ctx: CtxSpy | Ctx): UserDetailed => {
  let user: UserDetailed | null = null;

  if (typeof ctx.spy !== 'undefined') {
    user = ctx.spy(currentUserAtom)
  } else {
    user = ctx.get(currentUserAtom)
  }

  if (!user) {
    throw new Error("User not defined")
  }

  return user;
}

export async function getUserGlobalOptions(args?: RequestInit) {
  const res = await forumUserClient.user["get-user-global-options"].$get({}, { init: { ...args } })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data;
}