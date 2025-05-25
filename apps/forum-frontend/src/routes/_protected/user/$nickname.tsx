import { createFileRoute } from '@tanstack/react-router'
import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { lazy, Suspense } from "react"
import { UserContentSkeleton } from "#components/skeletons/components/user-profile-skeleton";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserProfilePosts as Posts } from "#components/profile/posts/posts/components/profile-posts.tsx";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { ProfileSkinControls } from "#components/profile/skin/components/profile-skin-controls.tsx";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from '@reatom/npm-react';
import { reatomLoader } from '@repo/lib/utils/reatom-loader';
import {
  requestedUserSectionIsPrivatedAtom,
  requestedUserAction,
  requestedUserAtom,
  requestedUserGameStatsVisibleAtom,
  requestedUserIsSameAtom,
  requestedUserParamAtom,
  requestedUserProfileBlockedAtom,
  requestedUserProfileStatusAtom
} from '#components/profile/requested-user.model';
import { SectionPrivatedTrigger } from '#components/templates/components/section-privated-trigger';

const SkinRender = lazy(() => import("#components/profile/skin/components/profile-skin-render.tsx").then(m => ({ default: m.ProfileSkinRender })))
const Account = lazy(() => import("#components/profile/account/components/profile-account.tsx").then(m => ({ default: m.UserProfileAccount })))
const GameStats = lazy(() => import("#components/profile/stats/components/profile-stats.tsx").then(m => ({ default: m.UserProfileGameStats })))
const Friends = lazy(() => import("#components/profile/friends/components/profile-friends.tsx").then(m => ({ default: m.UserProfileFriends })))
const Threads = lazy(() => import("#components/profile/threads/components/profile-threads.tsx").then(m => ({ default: m.UserProfileThreads })))
const GameAchievements = lazy(() => import("#components/profile/achievements/components/profile-game-ach.tsx").then(m => ({ default: m.UserProfileGameAchievements })))
const Blocked = lazy(() => import("#components/templates/components/user-blocked").then(m => ({ default: m.UserBlocked })));
const Banned = lazy(() => import("#components/templates/components/user-banned").then(m => ({ default: m.UserBanned })));

export const Route = createFileRoute('/_protected/user/$nickname')({
  component: reatomComponent(({ ctx }) => {
    const { nickname: target } = Route.useParams()

    switch (ctx.spy(requestedUserProfileStatusAtom)) {
      case "banned":
        return (
          <Suspense><Banned requestedUserNickname={target} /></Suspense>
        );
      case "blocked":
        return (
          <Suspense><Blocked blockedType={ctx.spy(requestedUserProfileBlockedAtom)} /></Suspense>
        )
      default:
        return (
          <div className="flex flex-col gap-6 w-full h-full relative">
            <UserCoverLayout>
              <ProfileContentTabs />
            </UserCoverLayout>
          </div>
        )
    }
  }, "RouteComponent"),
  loader: reatomLoader(async (context, routerCtx) => {
    // todo: fix ts error with params
    // @ts-ignore
    const target = routerCtx.params.nickname

    requestedUserParamAtom(context, target)
  }),
  head: ({ params: { nickname } }) => ({
    meta: [
      {
        title: nickname,
        description: `Профиль игрока ${nickname}`,
        keywords: [nickname ?? "player", `fasberry profile player`, `${nickname} profile`,],
      }
    ]
  }),
})

const TabsListContent = reatomComponent(({ ctx }) => {
  return (
    <>
      <TabsTrigger value="posts" className="rounded-r-none !rounded-l-lg">
        <Typography className="font-semibold">Посты</Typography>
      </TabsTrigger>
      <TabsTrigger value="threads" className="rounded-none">
        <Typography className="font-semibold">Треды</Typography>
      </TabsTrigger>
      <TabsTrigger value="friends" className="rounded-none">
        <Typography className="font-semibold">Друзья</Typography>
      </TabsTrigger>
      <Separator orientation="vertical" className="hidden lg:block" />
      {ctx.spy(requestedUserGameStatsVisibleAtom) && (
        <>
          <TabsTrigger value="game-stats" className="peer rounded-none">
            <Typography className="font-semibold">Статистика</Typography>
          </TabsTrigger>
          {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
        </>
      )}
      <TabsTrigger
        data-owner={ctx.spy(requestedUserIsSameAtom)}
        value="achievements"
        className="data-[owner=true]:rounded-none data-[owner=false]:rounded-l-none data-[owner=false]:rounded-r-lg"
      >
        <Typography className="font-semibold">Достижения</Typography>
      </TabsTrigger>
      {ctx.spy(requestedUserIsSameAtom) && (
        <>
          <Separator orientation="vertical" className="hidden lg:block" />
          <TabsTrigger value="account" className="peer rounded-r-lg rounded-l-none">
            <Typography className="font-semibold">Аккаунт</Typography>
          </TabsTrigger>
          {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
        </>
      )}
    </>
  )
}, "TabsListContent")

const ProfileContentTabs = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom)
  const isLoading = ctx.spy(requestedUserAction.statusesAtom).isPending || !requestedUser

  if (isLoading) return <UserContentSkeleton />

  return (
    <Tabs defaultValue="posts" className="flex flex-col w-full h-full lg:px-12 gap-y-6 relative z-[4]">
      <TabsList className="md:hidden flex items-center profile-tabs-list justify-start px-2 py-4 overflow-x-auto bg-shark-900 w-full">
        <TabsListContent />
      </TabsList>
      <TabsList className="hidden md:flex justify-start w-fit bg-shark-900">
        <TabsListContent />
      </TabsList>
      <div id="profile-content" className="flex flex-col lg:flex-row items-start gap-12 w-full">
        <div className="flex grow *:w-full w-full">
          <TabsContent value="posts">
            <Posts />
          </TabsContent>
          <TabsContent value="threads">
            <Suspense><Threads /></Suspense>
          </TabsContent>
          <TabsContent value="friends">
            <Suspense><Friends /></Suspense>
          </TabsContent>
          {ctx.spy(requestedUserGameStatsVisibleAtom) && (
            <TabsContent value="game-stats">
              <Suspense><GameStats isSectionPrivated={ctx.spy(requestedUserSectionIsPrivatedAtom)} /></Suspense>
            </TabsContent>
          )}
          <TabsContent value="achievements">
            <Suspense><GameAchievements /></Suspense>
          </TabsContent>
          {ctx.spy(requestedUserIsSameAtom) && (
            <TabsContent value="account">
              <Suspense><Account /></Suspense>
            </TabsContent>
          )}
        </div>
        <div className="hidden 2xl:flex h-[600px] flex-col w-1/3">
          <div className="flex flex-col h-full w-full gap-4">
            <Suspense fallback={<Skeleton className="w-full h-full" />}><SkinRender /></Suspense>
            <ProfileSkinControls />
          </div>
        </div>
      </div>
    </Tabs>
  );
}, "ProfileContentTabs")