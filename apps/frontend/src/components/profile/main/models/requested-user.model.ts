import { action, Atom, atom, batch, Ctx } from '@reatom/core';
import { userClient } from "#shared/forum-client";
import { withReset } from '@reatom/framework';
import { VariantProps } from 'class-variance-authority';
import { coverAreaVariants } from '../../header/components/cover-area';
import { currentUserNicknameAtom } from '#components/user/models/current-user.model';
import { withHistory } from '#shared/helpers/with-history';
import type { UserDetailed, UserShorted } from "@repo/types/entities/user-type";
import { log } from '#shared/utils/log';
import { validateResponse } from '#shared/api/validation';

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
  outline: string | null
}

type Details = {
  details: {
    status: "banned" | "private" | "blocked-by-you" | "blocked-by-user" | null,
    account_type: null
  },
  profiles: Array<{
    type: "minecraft" | string,
    value: string
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

export const requestedUserProfilesAtom = atom<RequestedUserFull["profiles"]>([], "requestedUserProfiles")

requestedUserPreferencesAtom.onChange((ctx, target) => {
  if (!target) return;

  const backgroundColor = ctx.get(requestedUserCoverImageAtom) ? "transparent" : "gray"
  const is_donate = ctx.get(requestedUserAtom)?.is_donate
  const outline = (is_donate && target.cover_outline_visible) ? "#FFFFFF" : null

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
      requestedUserProfileStatusAtom(ctx, status)
      requestedUserCoverImageAtom(ctx, user.cover_image);

      requestedUserProfilesAtom(ctx, user.profiles)
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
    console.error("Unexpected payload type", payload);
  }
}, "defineUser")

export async function getUserProfile(nickname: string, init?: RequestInit) {
  const res = await userClient.user["user-profile"][":nickname"].$get({ param: { nickname } }, { init })
  return validateResponse<typeof res>(res);
}

export const isParamChanged = (
  ctx: Ctx,
  param: Atom<string | null> & { history: Atom<[current: string | null, ...past: (string | null)[]]> },
  current: string,
  fn: () => void
) => {
  if (!current) return;

  const prev = ctx.get(param.history)[1]

  if (prev !== undefined && current !== prev) fn()
}

requestedUserAtom.onChange((_, v) => log("requestedUserAtom", v))
requestedUserParamAtom.onChange((_, v) => log("requestedUserParamAtom", v))
requestedUserIsSameAtom.onChange((_, v) => log("requestedUserIsSameAtom", v))
requestedUserPreferencesAtom.onChange((_, v) => log("requestedUserPreferencesAtom", v))
requestedUserGameStatsVisibleAtom.onChange((_, v) => log("requestedUserGameStatsVisibleAtom", v))
requestedUserSectionIsPrivatedAtom.onChange((_, v) => log("requestedUsersectionIsPrivatedAtom", v))
requestedUserProfileStatusAtom.onChange((_, v) => log("requestedUserProfileStatusAtom", v))
requestedUserProfileBlockedAtom.onChange((_, v) => log("requestedUserProfileBlockedAtom", v))
requestedUserCoverImageAtom.onChange((_, v) => log("requestedUserCoverImageAtom", v))
requestedUserCoverDetailsAtom.onChange((_, v) => log("requestedUserCoverDetailsAtom", v))
requestedUserAccountTypeAtom.onChange((_, v) => log("requestedUserAccountTypeAtom", v))