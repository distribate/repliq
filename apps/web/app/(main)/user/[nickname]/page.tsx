import { Metadata } from 'next';
import { MetadataType, PageConventionProps } from '@repo/types/config/page-types.ts';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/src/components/tabs.tsx';
import { getRequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { UserCoverLayout } from '@repo/components/src/profile/components/cover/cover/components/cover-layout.tsx';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { UserContentSkeleton } from '@repo/components/src/skeletons/user-content-skeleton.tsx';
import { ProfilePrivated } from '@repo/components/src/templates/profile-privated.tsx';
import { UserProfileSkin } from '@repo/components/src/profile/components/skin/skin.tsx';
import { checkProfileStatus } from '@repo/lib/helpers/check-profile-status.ts';
import { getBanDetails } from '@repo/lib/helpers/get-ban-details.ts';
import { UserBlocked } from '@repo/components/src/templates/user-blocked.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { UserProfilePosts } from '@repo/components/src/profile/components/posts/components/users-posts/components/user-profile-posts.tsx';
import { validateRequest } from '@repo/lib/utils/auth/validate-requests.ts';
import { checkUserGameStatsVisibility } from '@repo/lib/helpers/check-user-game-stats-visibility.ts';
import { protectPrivateArea } from '@repo/lib/helpers/protect-private-area.ts';
import dynamic from 'next/dynamic';
import {
  REQUESTED_USER_QUERY_KEY
} from '@repo/components/src/profile/components/cover/cover/queries/requested-user-query.ts';

const UserProfileFriends = dynamic(() =>
  import("@repo/components/src/profile/components/friends/friends.tsx")
  .then(m => m.UserProfileFriends)
)

const UserProfileThreads = dynamic(() =>
  import("@repo/components/src/profile/components/threads/threads.tsx")
  .then(m => m.UserProfileThreads)
)

const UserProfileGameStats = dynamic(() =>
  import("@repo/components/src/profile/components/stats/stats/stats.tsx")
  .then(m => m.UserProfileGameStats)
)

const UserBanned = dynamic(() =>
  import("@repo/components/src/templates/user-banned.tsx")
  .then(m => m.UserBanned)
)

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { nickname } = params;
  
  return {
    title: nickname,
    description: `Профиль игрока ${nickname}`,
    keywords: [ nickname ? nickname : 'player', 'profile', `profile of ${nickname}`, `fasberry profile player`, `${nickname} profile` ],
  };
}

export default async function ProfilePage({
  params
}: PageConventionProps) {
  if (!params) return;
  
  const qc = new QueryClient();
  
  const { user } = await validateRequest()
  if (!user) return;
  
  const { nickname: reqUserNickname } = params;
  
  const reqUser = await getRequestedUser(reqUserNickname);
  
  if (typeof reqUser === 'string') {
    return redirect(reqUser);
  }
  
  const { nickname: currentUserNickname } = user;
  const preferences = reqUser.preferences;
  const reqUserUUID = reqUser.uuid;
  
  await qc.prefetchQuery({
    queryKey: REQUESTED_USER_QUERY_KEY(reqUserNickname),
    queryFn: () => getRequestedUser(reqUserNickname),
  });
  
  const profileStatus = await checkProfileStatus(reqUser);
  
  if (profileStatus === 'banned') {
    const banDetails = await getBanDetails({
      nickname: reqUserNickname,
    });
    
    return <UserBanned {...banDetails} />;
  }
  
  const isBlocked = profileStatus === 'blocked';
  const isPrivated = profileStatus === 'private';

  const isGameStatsShow = checkUserGameStatsVisibility({
    reqUserNickname: reqUserNickname, preferences, currentUserNickname
  })
  
  const isOwner = await protectPrivateArea({ requestedUserNickname: reqUserNickname });
  
  return (
    <div className="flex flex-col w-full relative">
      <HydrationBoundary state={dehydrate(qc)}>
        <UserCoverLayout
          reqUserNickname={reqUserNickname}
          type={isBlocked ? 'blocked' : 'default'}
        />
      </HydrationBoundary>
      <Suspense fallback={<UserContentSkeleton />}>
        {isBlocked && <UserBlocked />}
        {isPrivated && <ProfilePrivated />}
        {!isPrivated && !isBlocked && (
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
              {isGameStatsShow && <TabsTrigger value="game-stats">Статистика</TabsTrigger>}
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
              {isOwner && (<>
                  <Separator orientation="vertical" />
                  <TabsTrigger value="account-stats">
                    Аккаунт
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            <div className="flex items-start gap-12 w-full">
              <div className="flex grow *:w-full w-full">
                <TabsContent value="posts">
                  <UserProfilePosts nickname={reqUserNickname} />
                </TabsContent>
                <TabsContent value="topics">
                  <UserProfileThreads nickname={reqUserNickname} />
                </TabsContent>
                <TabsContent value="friends">
                  <UserProfileFriends nickname={reqUserNickname} />
                </TabsContent>
                {isGameStatsShow && (
                  <TabsContent value="game-stats">
                    <UserProfileGameStats
                      nickname={reqUserNickname}
                      uuid={reqUserUUID}
                    />
                  </TabsContent>
                )}
                <TabsContent value="account-stats">
                  <div className="flex flex-col w-full py-6">Account stats</div>
                </TabsContent>
              </div>
              <div className="flex flex-col w-1/3 h-full">
                <UserProfileSkin reqUserNickname={reqUserNickname} />
              </div>
            </div>
          </Tabs>
        )}
      </Suspense>
    </div>
  );
}