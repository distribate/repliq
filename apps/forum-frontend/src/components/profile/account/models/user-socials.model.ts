import { reatomResource, withCache, withDataAtom, withStatusesAtom } from '@reatom/async'
import { currentUserAtom } from '#components/user/models/current-user.model'
import { forumUserClient } from '@repo/shared/api/forum-client'
import { atom } from '@reatom/core'
import { withReset } from '@reatom/framework'

const getUserSocials = async (nickname: string) => {
  const res = await forumUserClient.user["get-user-socials"].$get({ param: { nickname } })
  const data = await res.json()

  if (!data || 'error' in data) return null

  return data.data
}

export const telegramAtom = atom<{ created_at: string, value: string } | null>(null, "telegram").pipe(withReset())
export const discordAtom = atom<{ created_at: string, value: string } | null>(null, "discord").pipe(withReset())

export const userSocialsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getUserSocials(nickname))
}).pipe(withDataAtom(), withStatusesAtom(), withCache())

userSocialsResource.dataAtom.onChange((ctx, state) => {
  if (!state) return;

  telegramAtom(ctx, state.find(target => target.type === 'telegram') ?? null)
  discordAtom(ctx, state.find(target => target.type === 'discord') ?? null)
})