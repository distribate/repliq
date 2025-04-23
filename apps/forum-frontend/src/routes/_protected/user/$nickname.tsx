import { createFileRoute } from '@tanstack/react-router'
import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { lazy, Suspense } from "react"
import { UserContentSkeleton } from "#components/skeletons/components/user-profile-skeleton";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { requestedUserQuery } from "@repo/lib/queries/requested-user-query.ts";
import { UserProfilePosts } from "#components/profile/posts/posts/components/profile-posts.tsx";
import { UserPostsSkeleton } from "#components/skeletons/components/user-posts-skeleton";
import { getUser } from "@repo/lib/helpers/get-user";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { ProfileSkinControls } from "#components/profile/skin/components/profile-skin-controls.tsx";
import { Typography } from "@repo/ui/src/components/typography";
import { UserDetailed } from '@repo/types/entities/user-type';
import { friendStatusOpts } from '#components/friend/components/friend-button/queries/friend-status-query';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query';

export const Route = createFileRoute('/_protected/user/$nickname')({
  component: RouteComponent,
  head: ({ params: { nickname } }) => ({
    meta: [
      {
        title: nickname,
        description: `Профиль игрока ${nickname}`,
        keywords: [nickname ?? "player", `fasberry profile player`, `${nickname} profile`,],
      }
    ]
  }),
  loader: async ({ context: ctx, params: { nickname } }) => {
    const currentUser = ctx.queryClient.getQueryData<UserDetailed>(CURRENT_USER_QUERY_KEY)

    if (!currentUser) return;

    await ctx.queryClient.ensureQueryData({ ...friendStatusOpts(currentUser.nickname, nickname) })
  }
})

const ProfileSkinRender = lazy(() => import("#components/profile/skin/components/profile-skin-render.tsx")
  .then(m => ({ default: m.ProfileSkinRender }))
)

const ProfileAccount = lazy(() => import("#components/profile/account/components/profile-account.tsx")
  .then(m => ({ default: m.UserProfileAccount }))
)

const ProfileGameStats = lazy(() => import("#components/profile/stats/components/profile-stats.tsx")
  .then(m => ({ default: m.UserProfileGameStats }))
)

const ProfileFriends = lazy(() => import("#components/profile/friends/components/profile-friends.tsx")
  .then(m => ({ default: m.UserProfileFriends }))
)

const ProfileThreads = lazy(() => import("#components/profile/threads/components/profile-threads.tsx")
  .then(m => ({ default: m.UserProfileThreads }))
)

const ProfileGameAchievements = lazy(() => import("#components/profile/achievements/components/profile-game-ach.tsx")
  .then(m => ({ default: m.UserProfileGameAchievements }))
)

const SectionPrivatedTrigger = lazy(() => import("#components/templates/components/section-privated-trigger")
  .then(m => ({ default: m.SectionPrivatedTrigger }))
);

const Blocked = lazy(() => import("#components/templates/components/user-blocked")
  .then(m => ({ default: m.UserBlocked }))
);

const Banned = lazy(() => import("#components/templates/components/user-banned")
  .then(m => ({ default: m.UserBanned }))
);

const ProfilePrivated = lazy(() => import("#components/templates/components/profile-privated")
  .then(m => ({ default: m.ProfilePrivated }))
);

const ProfileContentTabs = ({
  nickname: requestedUserNickname
}: Pick<UserDetailed, "nickname">) => {
  const { nickname: currentUserNickname } = getUser()
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname)

  if (!requestedUser) return null;

  let isGameStatsShow: boolean = false;

  if (isUserDetailed(requestedUser)) {
    isGameStatsShow = requestedUser.preferences.game_stats_visible;
  }

  const isOwner = currentUserNickname === requestedUserNickname;

  if (isOwner) {
    isGameStatsShow = true;
  }

  const isSectionPrivated = !isGameStatsShow && requestedUserNickname === currentUserNickname;

  return (
    <Tabs
      id="main-content"
      defaultValue="posts"
      className="flex flex-col w-full h-full lg:px-12 gap-y-6 relative z-[4]"
    >
      <TabsList className="grid grid-cols-2 auto-rows-auto bg-shark-900 lg:flex lg:justify-start w-full lg:w-fit">
        <TabsTrigger value="posts" className="rounded-r-none !rounded-l-lg">
          <Typography className="font-semibold">Посты</Typography>
        </TabsTrigger>
        <TabsTrigger value="topics" className="rounded-none">
          <Typography className="font-semibold">Треды</Typography>
        </TabsTrigger>
        <TabsTrigger value="friends" className="rounded-none">
          <Typography className="font-semibold">Друзья</Typography>
        </TabsTrigger>
        <Separator orientation="vertical" className="hidden lg:block" />
        {isGameStatsShow && (
          <>
            <TabsTrigger value="game-stats" className="peer rounded-none">
              <Typography className="font-semibold">Статистика</Typography>
            </TabsTrigger>
            {isSectionPrivated && <SectionPrivatedTrigger />}
          </>
        )}
        <TabsTrigger value="achievements" className={`${isOwner ? "rounded-none" : "rounded-l-none rounded-r-lg"}`}>
          <Typography className="font-semibold">Достижения</Typography>
        </TabsTrigger>
        {isOwner && (
          <>
            <Separator orientation="vertical" className="hidden lg:block" />
            <TabsTrigger value="account-stats" className="peer rounded-r-lg rounded-l-none">
              <Typography className="font-semibold">Аккаунт</Typography>
            </TabsTrigger>
            <SectionPrivatedTrigger />
          </>
        )}
      </TabsList>
      <div className="flex flex-col lg:flex-row items-start gap-12 w-full">
        <div className="flex grow *:w-full w-full">
          <TabsContent value="posts">
            <Suspense fallback={<UserPostsSkeleton />}>
              <UserProfilePosts nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          <TabsContent value="topics">
            <Suspense>
              <ProfileThreads nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          <TabsContent value="friends">
            <Suspense>
              <ProfileFriends nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          {isGameStatsShow && (
            <TabsContent value="game-stats">
              <Suspense>
                <ProfileGameStats nickname={requestedUserNickname} isSectionPrivated={isSectionPrivated} />
              </Suspense>
            </TabsContent>
          )}
          <TabsContent value="achievements">
            <Suspense>
              <ProfileGameAchievements nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          {isOwner && (
            <TabsContent value="account-stats">
              <Suspense>
                <ProfileAccount />
              </Suspense>
            </TabsContent>
          )}
        </div>
        <div className="hidden 2xl:flex h-[600px] flex-col w-1/3">
          <div className="flex flex-col h-full w-full gap-4">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <ProfileSkinRender nickname={requestedUserNickname} />
            </Suspense>
            <ProfileSkinControls nickname={requestedUserNickname} />
          </div>
        </div>
      </div>
    </Tabs>
  );
};

function RouteComponent() {
  const { nickname: requestedUserNickname } = Route.useParams()
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname)

  const profileStatus = requestedUser?.details;

  if (profileStatus?.status === 'banned') {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <Banned requestedUserNickname={requestedUserNickname} />
      </Suspense>
    );
  }

  const blockedType = profileStatus?.status === 'blocked-by-you' ? 'blocked-by-you' : 'blocked-by-user';

  const isBlocked = (profileStatus?.status === 'blocked-by-you'
    || profileStatus?.status === 'blocked-by-user')

  const isPrivate = profileStatus?.status === 'private'

  if (isBlocked) {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <Blocked blockedType={blockedType} />
      </Suspense>
    )
  }

  if (isPrivate) {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <ProfilePrivated />
      </Suspense>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <UserCoverLayout nickname={requestedUserNickname}>
        <Suspense fallback={<UserContentSkeleton />}>
          <ProfileContentTabs nickname={requestedUserNickname} />
        </Suspense>
      </UserCoverLayout>
    </div>
  )
}