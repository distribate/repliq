import { reatomResource, withCache, withDataAtom, withStatusesAtom } from '@reatom/async'
import { currentUserAtom } from '#components/user/models/current-user.model'
import { forumUserClient } from '@repo/shared/api/forum-client'

type UserSocials = {
  TELEGRAM_ID: string | null,
  DISCORD_ID: string | null
} | null

const getUserSocials = async (nickname: string) => {
  const res = await forumUserClient.user["get-user-socials"].$get({  param: { nickname }})
  const data = await res.json()

  if (!data || 'error' in data) return null

  return data.data
}

export const userSocialsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getUserSocials(nickname))
}).pipe(withDataAtom(), withStatusesAtom(), withCache())