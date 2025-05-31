import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { Page } from '#components/profile/main/components/profile-main'
import { requestedUserAtom } from '#components/profile/main/models/requested-user.model'
import { reatomComponent } from '@reatom/npm-react'
import { Head, useSeoMeta } from '@unhead/react'
import { wrapTitle } from "@repo/lib/utils/wrap-title"
import { USER_URL } from '@repo/shared/constants/routes'
import { avatarAtom } from '#components/user/avatar/models/avatar.model'
import { KEYWORDS, PATHNAME } from '@repo/shared/constants/meta'

const AVATAR_FALLBACK = "https://hub.fasberry.su/images/avatar-steve.png"

const userDescription = (nickname?: string, description?: string | null) => 
  `Профиль игрока ${nickname}. ${description ? `О себе: ${description}` : null}`
const userKeywords = (nickname?: string) =>
  `player, fasberry profile player, ${nickname} profile, игрок ${nickname}, ${nickname}, пользователь ${nickname}`

const UserHead = reatomComponent(({ ctx }) => {
  const user = ctx.spy(requestedUserAtom)
  const avatar = user?.nickname ? ctx.spy(avatarAtom(user.nickname)).url : AVATAR_FALLBACK

  useSeoMeta({
    title: wrapTitle(user?.nickname),
    description: userDescription(user?.nickname, user?.description),
    ogTitle: wrapTitle(user?.nickname),
    ogDescription: userDescription(user?.nickname, user?.description),
    ogUrl: PATHNAME + USER_URL + user?.nickname,
    twitterTitle: wrapTitle(user?.nickname),
    twitterDescription: userDescription(user?.nickname, user?.description),
    ogImage: {
      url: avatar,
      width: 1200,
      height: 600,
      alt: 'image',
      type: 'image/png'
    },
    twitterImage: {
      url: avatar,
      width: 1200,
      height: 600,
      alt: 'image',
      type: 'image/png'
    },
  })

  return (
    <Head>
      <title>{wrapTitle(user?.nickname)}</title>
      <meta name="description" content={userDescription(user?.nickname, user?.description)} />
      <meta name="keywords" content={userKeywords(user?.nickname).concat(', ' + KEYWORDS)} />
    </Head>
  )
})

export function UserRouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <UserHead />
      <UserCoverLayout>
        <Page />
      </UserCoverLayout>
    </div>
  )
}