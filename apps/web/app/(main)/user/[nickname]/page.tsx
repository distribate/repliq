import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/src/components/tabs.tsx';
import { getRequestedUser, RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { Suspense } from 'react';
import { checkProfileStatus, ProfileStatusBlockedType } from '@repo/lib/helpers/check-profile-status.ts';
import { getBanDetails } from '@repo/lib/helpers/get-ban-details.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { validateRequest } from '@repo/lib/utils/auth/validate-requests.ts';
import { checkUserGameStatsVisibility } from '@repo/lib/helpers/check-user-game-stats-visibility.ts';
import { protectPrivateArea } from '@repo/lib/helpers/protect-private-area.ts';
import { MetadataType, PageConventionProps } from '@repo/types/global';
import dynamic from 'next/dynamic';
import type { User } from 'lucia';
import { UserPostsSkeleton } from '@repo/components/src/skeletons/user-posts-skeleton.tsx';
import { UserCoverSkeleton } from '@repo/components/src/skeletons/user-cover-skeleton.tsx';
import { BLOCKED_QUERY_KEY } from '@repo/lib/queries/blocked-user-query.ts';
import { checkProfileIsBlocked } from '@repo/lib/helpers/check-profile-is-blocked.ts';
import { getRequests } from '@repo/components/src/friends/queries/get-requests.ts';
import { REQUESTS_QUERY_KEY } from '@repo/components/src/friends/queries/requests-query.ts';
import { FRIENDS_QUERY_KEY } from '@repo/components/src/friends/queries/friends-query.ts';
import { getFriends } from '@repo/components/src/friends/queries/get-friends.ts';
import {
  REQUESTED_USER_QUERY_KEY
} from '@repo/components/src/profile/components/cover/queries/requested-user-query.ts';
import { UserCoverLayout } from '@repo/components/src/profile/components/cover/components/cover-layout.tsx';

const UserProfilePosts = dynamic(() =>
  import('@repo/components/src/profile/components/posts/components/posts/components/profile-posts.tsx')
  .then(m => m.ProfilePosts),
);

const UserProfileAccountStats = dynamic(() =>
  import('@repo/components/src/profile/components/account-stats/components/profile-account-stats.tsx')
  .then(m => m.UserProfileAccountStats),
);

const ProfilePrivated = dynamic(() =>
  import('@repo/components/src/templates/profile-privated.tsx')
  .then(m => m.ProfilePrivated),
);

const UserProfileGameAchievements = dynamic(() =>
  import('@repo/components/src/profile/components/achievements/components/profile-game-achievements.tsx')
  .then(m => m.UserProfileGameAchievements),
);

const UserBlocked = dynamic(() =>
  import('@repo/components/src/templates/user-blocked.tsx')
  .then(m => m.UserBlocked),
);

const UserProfileFriends = dynamic(() =>
  import('@repo/components/src/profile/components/friends/components/profile-friends.tsx')
  .then(m => m.UserProfileFriends),
);

const UserProfileThreads = dynamic(() =>
  import('@repo/components/src/profile/components/threads/components/profile-threads.tsx')
  .then(m => m.UserProfileThreads),
);

const UserProfileGameStats = dynamic(() =>
  import('@repo/components/src/profile/components/stats/components/profile-stats.tsx')
  .then(m => m.UserProfileGameStats),
);

const UserBanned = dynamic(() =>
  import('@repo/components/src/templates/user-banned.tsx')
  .then(m => m.UserBanned),
);

const UserProfileSkin = dynamic(() =>
  import('@repo/components/src/profile/components/skin/components/profile-skin.tsx')
  .then(m => m.UserProfileSkin),
);

const SectionPrivatedTrigger = dynamic(() =>
  import('@repo/components/src/templates/section-privated-trigger.tsx')
  .then(m => m.SectionPrivatedTrigger),
);

type ProfileContentPageProps = {
  requestedUser: RequestedUser,
  currentUser: User
}

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { nickname } = params;
  return {
    title: nickname,
    description: `Профиль игрока ${nickname}`,
    keywords: [
      nickname ? nickname : 'player', 'profile', `profile of ${nickname}`, `fasberry profile player`, `${nickname} profile`,
    ],
  };
}

const ProfileContentPage = async({
  requestedUser, currentUser,
}: ProfileContentPageProps) => {
  const { nickname: currentUserNickname } = currentUser;
  const preferences = requestedUser.preferences;
  const requestedUserUUID = requestedUser.uuid;
  const requestedUserNickname = requestedUser.nickname;
  
  const isOwner = await protectPrivateArea(requestedUserNickname);
  
  const isGameStatsShow = checkUserGameStatsVisibility({
    requestedUserNickname, preferences, currentUserNickname,
  });
  
  const isSectionPrivatedByOwner = !preferences.gameStatsVisibility
    && (requestedUserNickname === currentUserNickname);
  
  return (
    <Tabs
      id="main-content"
      defaultValue="posts"
      className="flex flex-col w-full h-full px-12 gap-y-6 pt-6 min-w-[400px] relative z-[4]"
    >
      <TabsList className="flex justify-start gap-2 w-full">
        <TabsTrigger value="posts">Посты</TabsTrigger>
        <TabsTrigger value="topics">Треды</TabsTrigger>
        <TabsTrigger value="friends">Друзья</TabsTrigger>
        <Separator orientation="vertical" />
        {isGameStatsShow && (
          <div className="relative">
            <TabsTrigger value="game-stats" className="peer">Статистика</TabsTrigger>
            {isSectionPrivatedByOwner && <SectionPrivatedTrigger />}
          </div>
        )}
        <TabsTrigger value="achievements">Достижения</TabsTrigger>
        {isOwner && (
          <>
            <Separator orientation="vertical" />
            <div className="relative">
              <TabsTrigger value="account-stats" className="peer">Аккаунт</TabsTrigger>
              <SectionPrivatedTrigger />
            </div>
          </>
        )}
      </TabsList>
      <div className="flex items-start gap-12 w-full">
        <div className="flex grow *:w-full w-full">
          <TabsContent value="posts">
            <Suspense fallback={<UserPostsSkeleton />}>
              <UserProfilePosts nickname={requestedUserNickname} />
            </Suspense>
          </TabsContent>
          <TabsContent value="topics">
            <UserProfileThreads nickname={requestedUserNickname} />
          </TabsContent>
          <TabsContent value="friends">
            <UserProfileFriends nickname={requestedUserNickname} />
          </TabsContent>
          {isGameStatsShow && (
            <TabsContent value="game-stats">
              <UserProfileGameStats
                nickname={requestedUserNickname}
                uuid={requestedUserUUID}
                isSectionPrivatedByOwner={isSectionPrivatedByOwner}
              />
            </TabsContent>
          )}
          <TabsContent value="achievements">
            <UserProfileGameAchievements nickname={requestedUserNickname} />
          </TabsContent>
          {isOwner && (
            <TabsContent value="account-stats">
              <UserProfileAccountStats />
            </TabsContent>
          )}
        </div>
        <div className="flex flex-col w-1/3 h-full">
          <UserProfileSkin reqUserNickname={requestedUserNickname} />
        </div>
      </div>
    </Tabs>
  );
};

export default async function ProfilePage({
  params,
}: PageConventionProps) {
  if (!params) return;
  
  const { user } = await validateRequest();
  if (!user) return;
  
  const { nickname: requestedUserNickname } = params;
  
  const requestedUser = await getRequestedUser(requestedUserNickname);
  if (!requestedUser) return;
  
  const qc = new QueryClient();
  
  const [ _, __, profileStatus ] = await Promise.all([
    qc.prefetchQuery({
      queryKey: BLOCKED_QUERY_KEY(requestedUserNickname),
      queryFn: () => checkProfileIsBlocked(requestedUserNickname)
    }),
    qc.prefetchQuery({
      queryKey: REQUESTED_USER_QUERY_KEY(requestedUserNickname),
      queryFn: () => getRequestedUser(requestedUserNickname),
    }),
    checkProfileStatus(requestedUser),
  ]);
  
  if (profileStatus === 'banned') {
    const banDetails = await getBanDetails({
      nickname: requestedUserNickname,
    });
    
    return <UserBanned {...banDetails} />;
  }
  
  const isBlocked = profileStatus === 'blocked-by-user'
    || profileStatus === 'user-blocked';
  const isPrivated = profileStatus === 'private';
  
  await Promise.all([
    qc.prefetchQuery({
      queryKey: REQUESTS_QUERY_KEY(user.nickname),
      queryFn: () => getRequests(user.nickname)
    }),
    qc.prefetchQuery({
      queryKey: FRIENDS_QUERY_KEY(user.nickname),
      queryFn: () => getFriends({
        nickname: user.nickname, orderType: "created_at"
      })
    })
  ])
  
  return (
    <div className="flex flex-col w-full relative">
      <Suspense fallback={<UserCoverSkeleton />}>
        <HydrationBoundary state={dehydrate(qc)}>
          <UserCoverLayout requestedUserNickname={requestedUserNickname} />
        </HydrationBoundary>
      </Suspense>
      {isBlocked && (
        <UserBlocked blockedType={profileStatus as ProfileStatusBlockedType} />
      )}
      {isPrivated && <ProfilePrivated />}
      {(!isPrivated && !profileStatus) && (
        <ProfileContentPage
          requestedUser={requestedUser}
          currentUser={user}
        />
      )}
    </div>
  );
}