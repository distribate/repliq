import { action, Atom, atom, batch, Ctx } from '@reatom/core';
import { userClient } from "#shared/forum-client";
import { withReset } from '@reatom/framework';
import { VariantProps } from 'class-variance-authority';
import { coverAreaVariants } from '../../header/components/cover-area';
import { logger } from '@repo/shared/utils/logger.ts';
import { currentUserNicknameAtom } from '#components/user/models/current-user.model';
import { withHistory } from '#lib/with-history';
import type { UserDetailed, UserShorted } from "@repo/types/entities/user-type";

type RequestedUserDetails = Pick<UserDetailed["preferences"],
  "game_stats_visible" | "real_name_visible" | "accept_friend_request" | "show_game_location" | "cover_outline_visible"
>

type RequestedUserProfileStatus = "banned" | "blocked" | "privated"
type RequestedUserBlocked = "blocked-by-you" | "blocked-by-user"

function isUserDetailed(user: UserShorted | UserDetailed): user is UserDetailed {
  return "favorite_item" in user && user.favorite_item !== undefined;
}

type RequestedUserCoverDetails = {
  backgroundColor: Pick<VariantProps<typeof coverAreaVariants>, "backgroundColor">["backgroundColor"]
  outline: string
}

type Details = {
  details: {
    status: "banned" | "private" | "blocked-by-you" | "blocked-by-user" | null,
    account_type: null
  },
  profiles: Array<{
    type: "minecraft" | string,
    user_id: string
  }>
}

export type RequestedUserFull = (UserDetailed & Details) | (UserShorted & Details)
export type RequestedUser =
  | Omit<UserShorted, "id" | "cover_image" | "preferences">
  | Omit<UserDetailed, "id" | "cover_image" | "preferences">

export const requestedUserParamAtom = atom<string>("", "requestedUserParam").pipe(withHistory(1), withReset())
export const requestedUserAtom = atom<RequestedUser | null>(null, "requestedUser").pipe(withReset())

export const requestedUserIsSameAtom = atom(false, "requestedUserIsSame").pipe(withReset())
export const requestedUserPreferencesAtom = atom<RequestedUserDetails | null>(null, "requestedUserDetails").pipe(withReset())
export const requestedUserGameStatsVisibleAtom = atom(false, "requestedUserGameStatsVisible").pipe(withReset())
export const requestedUserSectionIsPrivatedAtom = atom(false, "requestedUsersectionIsPrivated").pipe(withReset())
export const requestedUserProfileStatusAtom = atom<RequestedUserProfileStatus | null>(null, "requestedUserProfileStatus").pipe(withReset())
export const requestedUserProfileBlockedAtom = atom<RequestedUserBlocked | null>(null, "requestedUserProfileBlocked").pipe(withReset())
export const requestedUserCoverImageAtom = atom<string | null>(null, "requestedUserCoverImage").pipe(withReset())
export const requestedUserCoverDetailsAtom = atom<RequestedUserCoverDetails | null>(null, "requestedUserCoverDetails").pipe(withReset())
export const requestedUserAccountTypeAtom = atom<Pick<UserDetailed, "account_status">["account_status"]>(null, "requestedUserAccountType").pipe(withReset())
export const requestedUserMinecraftProfileIsExistsAtom = atom(false, "requestedUserMinecraftProfileIsExists").pipe(withReset())

requestedUserPreferencesAtom.onChange((ctx, target) => {
  if (!target) return;

  const backgroundColor = ctx.get(requestedUserCoverImageAtom) ? "transparent" : "gray"
  const is_donate = ctx.get(requestedUserAtom)?.is_donate
  const outline = (is_donate && target.cover_outline_visible) ? "#FFFFFF" : "default"

  requestedUserCoverDetailsAtom(ctx, { outline, backgroundColor })
})

export const defineUser = action((ctx, target: RequestedUserFull) => {
  const payload = target;

  if (typeof payload === 'object') {
    const account_status = payload.details.account_type;

    const isNonExists = account_status === 'deleted' || account_status === 'archived'

    batch(ctx, () => {
      requestedUserParamAtom(ctx, payload.nickname)
      requestedUserIsSameAtom(ctx, ctx.get(currentUserNicknameAtom) === payload.nickname)
    })

    // #privated or archived account status of req user
    if (isNonExists) {
      batch(ctx, () => {
        requestedUserAtom(ctx, {
          nickname: payload.nickname,
          description: null,
          is_donate: false,
          avatar: null,
          name_color: "#FFFFFF",
          account_status
        })

        requestedUserPreferencesAtom(ctx, {
          accept_friend_request: false,
          game_stats_visible: false,
          real_name_visible: false,
          cover_outline_visible: false,
          show_game_location: false
        })

        requestedUserAccountTypeAtom(ctx, account_status)
        requestedUserProfileStatusAtom(ctx, null)
        requestedUserCoverImageAtom(ctx, null)
      })

      return
    }

    const user = payload as RequestedUserFull

    requestedUserAtom(ctx, user)

    const isBanned = user.details.status === 'banned'
    const isBlocked = user.details.status === 'blocked-by-you' || user.details.status === 'blocked-by-user'
    const isPrivate = user.details.status === 'private'

    const status = isBanned ? "banned" : isBlocked ? "blocked" : isPrivate ? "privated" : null;

    if (isBlocked) {
      requestedUserProfileBlockedAtom(ctx, payload.details.status as 'blocked-by-you' | 'blocked-by-user')
    }

    batch(ctx, () => {
      requestedUserMinecraftProfileIsExistsAtom(ctx, user.profiles.some(target => target.type === 'minecraft'))
      requestedUserProfileStatusAtom(ctx, status)
      requestedUserCoverImageAtom(ctx, user.cover_image)
    })

    // #full variant of user
    if (isUserDetailed(user)) {
      const currentUser = ctx.get(currentUserNicknameAtom);

      const isIdentity = currentUser === user.nickname

      if (currentUser) {
        requestedUserSectionIsPrivatedAtom(ctx, !user.preferences.game_stats_visible && isIdentity)
      }

      batch(ctx, () => {
        requestedUserPreferencesAtom(ctx, {
          cover_outline_visible: user.preferences.cover_outline_visible,
          accept_friend_request: user.preferences.accept_friend_request,
          game_stats_visible: user.preferences.game_stats_visible,
          show_game_location: user.preferences.show_game_location,
          real_name_visible: user.preferences.real_name_visible
        })

        requestedUserGameStatsVisibleAtom(ctx, user.preferences.game_stats_visible)
      })
    } else {
      requestedUserPreferencesAtom(ctx, {
        cover_outline_visible: user.preferences.cover_outline_visible,
        show_game_location: user.preferences.show_game_location,
        game_stats_visible: false,
        real_name_visible: false,
        accept_friend_request: false
      })
    }
  } else {
    logger.error("Unexpected payload type", payload);
  }
}, "defineUser")

export async function getUserProfile(nickname: string, init?: RequestInit) {
  const res = await userClient.user["get-user-profile"][":nickname"].$get({ param: { nickname } }, { init })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)

  return data.data
}

export const isParamChanged = (
  ctx: Ctx,
  param: Atom<string | null> & { history: Atom<[current: string | null, ...past: (string | null)[]]> },
  target: string | null,
  fn: Function
) => {
  if (!target) return;
  const prev = ctx.get(param.history)[1]
  if (prev !== undefined && target !== prev) { fn() }
}

requestedUserAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserAtom", v))
requestedUserIsSameAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserIsSameAtom", v))
requestedUserPreferencesAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserPreferencesAtom", v))
requestedUserGameStatsVisibleAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserGameStatsVisibleAtom", v))
requestedUserSectionIsPrivatedAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUsersectionIsPrivatedAtom", v))
requestedUserProfileStatusAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserProfileStatusAtom", v))
requestedUserProfileBlockedAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserProfileBlockedAtom", v))
requestedUserCoverImageAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserCoverImageAtom", v))
requestedUserCoverDetailsAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserCoverDetailsAtom", v))
requestedUserAccountTypeAtom.onChange((_, v) => import.meta.env.DEV && logger.info("requestedUserAccountTypeAtom", v))