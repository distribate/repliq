import { reatomAsync, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { atom, Ctx } from '@reatom/core';
import { forumUserClient } from "@repo/shared/api/forum-client";
import { currentUserAtom, currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { UserDetailed, UserShorted } from '@repo/types/entities/user-type';
import consola from 'consola';
import { take, withReset } from '@reatom/framework';
import { router } from '#main';
import { isUserDetailed } from '@repo/lib/helpers/is-user-detailed';
import { withHistory } from "@repo/lib/utils/with-history"
import { VariantProps } from 'class-variance-authority';
import { coverAreaVariants } from './header/components/cover-area';

type RequestedUserDetails = Pick<UserDetailed["preferences"],
  "game_stats_visible" | "real_name_visible" | "accept_friend_request" | "show_game_location" | "cover_outline_visible"
> | null

type RequestedUser = UserShorted | UserDetailed | null

type RequestedUserProfileStatus = "banned" | "blocked" | "privated" | null

type RequestedUserBlocked = "blocked-by-you" | "blocked-by-user" | null

type RequestedUserCoverDetails = { 
  coverImage: string | undefined | null, 
  backgroundColor: Pick<VariantProps<typeof coverAreaVariants>, "backgroundColor">["backgroundColor"]
  backgroundImage: string | undefined, 
  outline: Pick<VariantProps<typeof coverAreaVariants>, "outline">["outline"]
} | null

export const requestedUserParamAtom = atom<string | null>(null, "requestedUserParam").pipe(withHistory(1), withReset())
export const requestedUserAtom = atom<RequestedUser>(null, "requestedUser").pipe(withReset())
export const requestedUserIsSameAtom = atom(false, "requestedUserIsSame").pipe(withReset())
export const requestedUserPreferencesAtom = atom<RequestedUserDetails>(null, "requestedUserDetails").pipe(withReset())
export const requestedUserGameStatsVisibleAtom = atom(false, "requestedUserGameStatsVisible").pipe(withReset())
export const requestedUserSectionIsPrivatedAtom = atom(false, "requestedUsersectionIsPrivated").pipe(withReset())
export const requestedUserProfileStatusAtom = atom<RequestedUserProfileStatus>(null, "requestedUserProfileStatus").pipe(withReset())
export const requestedUserProfileBlockedAtom = atom<RequestedUserBlocked>(null, "requestedUserProfileBlocked").pipe(withReset())
export const requestedUserCoverImageAtom = atom<string | null>(null, "requestedUserCoverImage").pipe(withReset())
export const requestedUserCoverDetailsAtom = atom<RequestedUserCoverDetails>(null, "requestedUserCoverDetails").pipe(withReset())

requestedUserAtom.onChange((_, v) => consola.info("requestedUserAtom", v))
requestedUserIsSameAtom.onChange((_, v) => consola.info("requestedUserIsSameAtom", v))
requestedUserPreferencesAtom.onChange((_, v) => consola.info("requestedUserPreferencesAtom", v))
requestedUserGameStatsVisibleAtom.onChange((_, v) => consola.info("requestedUserGameStatsVisibleAtom", v))
requestedUserSectionIsPrivatedAtom.onChange((_, v) => consola.info("requestedUsersectionIsPrivatedAtom", v))
requestedUserProfileStatusAtom.onChange((_, v) => consola.info("requestedUserProfileStatusAtom", v))
requestedUserProfileBlockedAtom.onChange((_, v) => consola.info("requestedUserProfileBlockedAtom", v))
requestedUserCoverImageAtom.onChange((_, v) => consola.info("requestedUserCoverImageAtom", v))
requestedUserCoverDetailsAtom.onChange((_, v) => consola.info("requestedUserCoverDetailsAtom", v))

const defineUserAction = reatomAsync(async (ctx, target: string) => {
  let nickname = ctx.get(currentUserNicknameAtom)

  if (!nickname) {
    nickname = await take(ctx, currentUserNicknameAtom)
  }

  if (!nickname) return

  requestedUserIsSameAtom(ctx, nickname === target)
  requestedUserAction(ctx, target)
})

requestedUserPreferencesAtom.onChange((ctx, state) => {
  if (state) {
    const donate = ctx.get(requestedUserAtom)?.donate
    const coverImage = ctx.get(requestedUserAtom)?.cover_image

    const backgroundImage = coverImage ? `url(${coverImage})` : ""
    const backgroundColor = coverImage ? "transparent" : "gray"
    const outline = (donate !== 'default' && state.cover_outline_visible) ? donate : "default"

    requestedUserCoverDetailsAtom(ctx, { coverImage, backgroundImage, backgroundColor, outline })
  }
})

function resetRequestedUser(ctx: Ctx) {
  requestedUserAtom.reset(ctx)
  requestedUserIsSameAtom.reset(ctx)
  requestedUserPreferencesAtom.reset(ctx)
  requestedUserGameStatsVisibleAtom.reset(ctx)
  requestedUserSectionIsPrivatedAtom.reset(ctx)
  requestedUserProfileStatusAtom.reset(ctx)
  requestedUserProfileBlockedAtom.reset(ctx)
  requestedUserCoverImageAtom.reset(ctx)
  requestedUserCoverDetailsAtom.reset(ctx)
}

requestedUserParamAtom.onChange((ctx, target) => {
  if (!target) return;

  const prev = ctx.get(requestedUserParamAtom.history)[1]

  if (prev !== undefined && target !== prev) {
    consola.log("requestedUser reset", target)
    resetRequestedUser(ctx)
  }

  defineUserAction(ctx, target)
})

export const isParamChanged = (ctx: Ctx, target: string | null, callback: Function) => {
  if (!target) return;

  const prev = ctx.get(requestedUserParamAtom.history)[1]

  if (prev !== undefined && target !== prev) callback()
}

async function getUserProfile(nickname: string) {
  const res = await forumUserClient.user["get-user-profile"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if (!data || "error" in data) return "not-exist"

  return data.data
}

export const requestedUserAction = reatomAsync(async (ctx, target: string) => {
  const currentUser = ctx.get(currentUserAtom)

  if (!target || !currentUser) return null;

  if (currentUser.nickname === target) {
    return { ...currentUser, details: { status: null } }
  }

  return await ctx.schedule(() => getUserProfile(target))
}, {
  name: "requestedUserAction",
  onFulfill: (ctx, payload) => {
    if (payload === null) {
      ctx.schedule(() => router.navigate({ to: "." }))
    } else if (payload === 'not-exist') {
      let destination = "."

      const nickname = ctx.get(currentUserNicknameAtom);

      if (nickname) {
        destination = nickname
      }

      ctx.schedule(() => router.navigate({
        to: "/not-exist", search: { redirect_nickname: destination, timeout: "5" }
      }))
    } else if (typeof payload === 'object' && payload !== null) {
      requestedUserAtom(ctx, payload)

      const isBanned = payload.details.status === 'banned'
      const isBlocked = payload.details.status === 'blocked-by-you' || payload.details.status === 'blocked-by-user'
      const isPrivate = payload.details.status === 'private'

      const status = isBanned ? "banned" : isBlocked ? "blocked" : isPrivate ? "privated" : null;

      requestedUserProfileStatusAtom(ctx, status)
      requestedUserCoverImageAtom(ctx, payload.cover_image)

      if (isBlocked) {
        requestedUserProfileBlockedAtom(ctx, payload.details.status as 'blocked-by-you' | 'blocked-by-user')
      }

      if (isUserDetailed(payload)) {
        const nickname = ctx.get(currentUserNicknameAtom);

        if (nickname) {
          requestedUserSectionIsPrivatedAtom(ctx,
            (!payload.preferences.game_stats_visible && nickname === payload.nickname)
          )
        }

        requestedUserPreferencesAtom(ctx, {
          cover_outline_visible: payload.preferences.cover_outline_visible,
          accept_friend_request: payload.preferences.accept_friend_request,
          game_stats_visible: payload.preferences.game_stats_visible,
          show_game_location: payload.preferences.show_game_location,
          real_name_visible: payload.preferences.real_name_visible
        })

        requestedUserGameStatsVisibleAtom(ctx, payload.preferences.game_stats_visible)
      }
    } else {
      consola.error("Unexpected payload type", payload);
    }
  },
}).pipe(withStatusesAtom(), withErrorAtom())