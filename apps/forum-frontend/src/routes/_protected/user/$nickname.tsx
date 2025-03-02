import { createFileRoute } from '@tanstack/react-router'
import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { lazy, Suspense } from "react"
import { UserContentSkeleton } from "#components/skeletons/user-profile-skeleton.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { requestedUserQuery } from "@repo/lib/queries/requested-user-query.ts";
import { UserProfilePosts } from "#components/profile/posts/posts/components/profile-posts.tsx";
import { UserPostsSkeleton } from "#components/skeletons/user-posts-skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { Selectable } from 'kysely';
import { Users } from "@repo/types/db/forum-database-types";
import { ProfileSkinControls } from "#components/profile/skin/components/profile-skin-controls.tsx";
import { Typography } from "@repo/ui/src/components/typography";

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
  })
})

const UserBlocked = lazy(() => import("#components/templates/user-blocked.tsx")
  .then(m => ({ default: m.UserBlocked }))
);

const UserBanned = lazy(() => import("#components/templates/user-banned.tsx")
  .then(m => ({ default: m.UserBanned }))
);

const ProfilePrivated = lazy(() => import("#components/templates/profile-privated.tsx")
  .then(m => ({ default: m.ProfilePrivated }))
);

export type ProfileContentProps = {
  nickname: string
}

const ProfileContent = ({
  nickname: requestedUserNickname
}: ProfileContentProps) => {
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname)

  const profileStatus = requestedUser?.details;

  if (profileStatus?.status === 'banned') {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <UserBanned requestedUserNickname={requestedUserNickname} />
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
        <UserBlocked blockedType={blockedType} />
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
    <Suspense fallback={<UserContentSkeleton />}>
      <ProfileContentTabs nickname={requestedUserNickname} />
    </Suspense>
  )
}

const ProfileSkinRender = lazy(() => import("#components/profile/skin/components/profile-skin-render.tsx")
  .then(m => ({ default: m.ProfileSkinRender }))
)

const UserProfileAccount = lazy(() => import("#components/profile/account/components/profile-account.tsx")
  .then(m => ({ default: m.UserProfileAccount }))
)

const UserProfileGameStats = lazy(() => import("#components/profile/stats/components/profile-stats.tsx")
  .then(m => ({ default: m.UserProfileGameStats }))
)

const UserProfileFriends = lazy(() => import("#components/profile/friends/components/profile-friends.tsx")
  .then(m => ({ default: m.UserProfileFriends }))
)

const UserProfileThreads = lazy(() => import("#components/profile/threads/components/profile-threads.tsx")
  .then(m => ({ default: m.UserProfileThreads }))
)

const UserProfileGameAchievements = lazy(() => import("#components/profile/achievements/components/profile-game-ach.tsx")
  .then(m => ({ default: m.UserProfileGameAchievements }))
)

const SectionPrivatedTrigger = lazy(() => import("#components/templates/section-privated-trigger.tsx")
  .then(m => ({ default: m.SectionPrivatedTrigger }))
);

export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

export const ProfileContentTabs = ({
  nickname: requestedUserNickname
}: ProfileContentProps) => {
  const currentUser = getUser()
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname)
  const { nickname: currentUserNickname } = currentUser;

  if (!requestedUser) return null;

  let requestedUserUUID: string | null = null;
  let isGameStatsShow: boolean = false;

  if (isUserDetailed(requestedUser)) {
    requestedUserUUID = requestedUser.uuid;
    isGameStatsShow = requestedUser.preferences.game_stats_visible;
  }

  const isOwner = currentUserNickname === requestedUserNickname;

  if (isOwner) {
    isGameStatsShow = true;
  }

  const isSectionPrivatedByOwner = !isGameStatsShow && requestedUserNickname === currentUserNickname;

  if (!requestedUserUUID) return null;

  return (
    <Tabs
      id="main-content"
      defaultValue="posts"
      className="flex flex-col w-full h-full lg:px-12 gap-y-6 relative z-[4]"
    >
      <TabsList className="grid grid-cols-2 auto-rows-auto bg-shark-900 lg:flex lg:justify-start w-full lg:w-fit">
        <TabsTrigger value="posts" className="rounded-r-none !rounded-l-lg">
          <Typography className="font-semibold">
            Посты
          </Typography>
        </TabsTrigger>
        <TabsTrigger value="topics" className="rounded-none">
          <Typography className="font-semibold">
            Треды
          </Typography>
        </TabsTrigger>
        <TabsTrigger value="friends" className="rounded-none">
          <Typography className="font-semibold">
            Друзья
          </Typography>
        </TabsTrigger>
        <Separator orientation="vertical" className="hidden lg:block" />
        {isGameStatsShow && (
          <>
            <TabsTrigger value="game-stats" className="peer rounded-none">
              <Typography className="font-semibold">
                Статистика
              </Typography>
            </TabsTrigger>
            {isSectionPrivatedByOwner && <SectionPrivatedTrigger />}
          </>
        )}
        <TabsTrigger value="achievements" className={`${isOwner ? "rounded-none" : "rounded-l-none rounded-r-lg"}`}>
          <Typography className="font-semibold">
            Достижения
          </Typography>
        </TabsTrigger>
        {isOwner && (
          <>
            <Separator orientation="vertical" className="hidden lg:block" />
            <TabsTrigger value="account-stats" className="peer rounded-r-lg rounded-l-none">
              <Typography className="font-semibold">
                Аккаунт
              </Typography>
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
              <UserProfileThreads nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          <TabsContent value="friends">
            <Suspense>
              <UserProfileFriends nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          {isGameStatsShow && (
            <TabsContent value="game-stats">
              <Suspense>
                <UserProfileGameStats
                  nickname={requestedUserNickname}
                  uuid={requestedUserUUID}
                  isSectionPrivatedByOwner={isSectionPrivatedByOwner}
                />
              </Suspense>
            </TabsContent>
          )}
          <TabsContent value="achievements">
            <Suspense>
              <UserProfileGameAchievements nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          {isOwner && (
            <TabsContent value="account-stats">
              <Suspense>
                <UserProfileAccount />
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
  const { nickname } = Route.useParams()

  return (
    <div className="flex flex-col gap-6 w-full h-full relative">
      <UserCoverLayout nickname={nickname}>
        <ProfileContent nickname={nickname} />
      </UserCoverLayout>
    </div>
  )
}