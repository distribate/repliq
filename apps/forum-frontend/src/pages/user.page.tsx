import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { requestedUserAccountTypeAtom, requestedUserAtom, requestedUserParamAtom, requestedUserProfileBlockedAtom, requestedUserProfileStatusAtom } from '#components/profile/main/models/requested-user.model'
import { reatomComponent } from '@reatom/npm-react'
import { Head, useSeoMeta } from '@unhead/react'
import { wrapTitle } from "@repo/lib/utils/wrap-title"
import { avatarAtom } from '#components/user/avatar/models/avatar.model'
import { KEYWORDS, PATHNAME } from '@repo/shared/constants/meta'
import { createIdLink } from '@repo/lib/utils/create-link'
import { FORUM_SITE_DOMAIN } from '@repo/shared/constants/origin-list'
import { lazy, Suspense } from 'react'
import { ProfileContentTabs } from '#components/profile/main/components/profile-main'

const Blocked = lazy(() => import("#components/templates/components/user-blocked").then(m => ({ default: m.UserBlocked })));
const Banned = lazy(() => import("#components/templates/components/user-banned").then(m => ({ default: m.UserBanned })));
const Deleted = lazy(() => import("#components/templates/components/user-deleted").then(m => ({ default: m.UserDeleted })))

const AVATAR_FALLBACK = `${FORUM_SITE_DOMAIN}/images/fasberry_logo.png`

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
    ogUrl: PATHNAME + createIdLink("user", user?.nickname!),
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

const Page = reatomComponent(({ ctx }) => {
  switch (ctx.spy(requestedUserAccountTypeAtom)) {
    case "archived":
    case "deleted":
      return (
        <Suspense>
          <Deleted />
        </Suspense>
      )
  }

  switch (ctx.spy(requestedUserProfileStatusAtom)) {
    case "banned":
      return (
        <Suspense>
          <Banned requestedUserNickname={ctx.spy(requestedUserParamAtom)!} />
        </Suspense>
      );
    case "blocked":
      return (
        <Suspense>
          <Blocked type={ctx.spy(requestedUserProfileBlockedAtom)!} />
        </Suspense>
      )
    default:
      return (
        <ProfileContentTabs />
      )
  }
}, "RouteComponent")

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