import ky from 'ky';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import { atom, Ctx, CtxSpy } from '@reatom/core';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { decode } from 'cbor-x';
import { withSsr } from '#lib/ssr';
import { withInit } from '@reatom/framework';

export const currentUserNicknameAtom = atom<string | null>(null, "currentUserNickname").pipe(
  withInit((ctx, _) => ctx.get(currentUserAtom)?.nickname ?? null)
)

export const CURRENT_USER_ATOM_KEY = "currentUserAtom"

export const currentUserAtom = atom<UserDetailed | null>(null, "currentUser").pipe(
  withSsr(CURRENT_USER_ATOM_KEY)
)

const client = ky.create({
  credentials: "include"
})

const url = forumUserClient.user["get-me"].$url()

export async function getUserInformation(
  args?: RequestInit
): Promise<UserDetailed> {
  const res = await client(url, { ...args })
  const encoded = await res.arrayBuffer()

  const data: WrappedResponse<UserDetailed> = decode(new Uint8Array(encoded));

  if ("error" in data) {
    console.error(data.error)
    throw new Error("Failed user information")
  }

  return data.data;
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
  if (!data || "error" in data) return null;
  return data.data;
}

const initial = {
  is_admin: false,
  can_create_threads: false,
  can_create_comments: false,
  can_create_posts: false,
  can_create_issue: false,
  has_new_notifications: false,
  has_new_friends: false,
}

export const userGlobalOptionsAtom = atom<typeof initial>(initial, "userGlobalOptions").pipe(
  withSsr("userGlobalOptionsAtom")
)