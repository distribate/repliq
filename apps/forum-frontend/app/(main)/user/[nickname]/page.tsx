import { Metadata } from 'next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/src/components/tabs.tsx';
import {
  getRequestedUser,
  RequestedUser,
} from '@repo/lib/queries/get-requested-user.ts';
import { Suspense } from 'react';
import {
  checkProfileStatus,
} from '@repo/lib/helpers/check-profile-status.ts';
import { getBanDetails } from '@repo/lib/helpers/get-ban-details.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { MetadataType, PageConventionProps } from '@repo/types/global';
import { UserPostsSkeleton } from '@repo/components/src/skeletons/user-posts-skeleton.tsx';
import { UserCoverSkeleton } from '@repo/components/src/skeletons/user-cover-skeleton.tsx';
import { UserCoverLayout } from '@repo/components/src/profile/components/cover/components/cover-layout.tsx';
import dynamic from 'next/dynamic';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';
import { Selectable } from 'kysely';
import type { Users } from '@repo/types/db/forum-database-types.ts';
import { createProfileView } from "@repo/lib/queries/create-profile-view.ts";
import { delay } from "@repo/lib/helpers/delay.ts";
import { UserProfilePosts } from '@repo/components/src/profile/components/posts/components/posts/components/profile-posts.tsx';

export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

const UserProfileAccountStats = dynamic(() =>
  import('@repo/components/src/profile/components/account-stats/components/profile-account.tsx')
    .then(m => m.UserProfileAccount),
);

const ProfilePrivated = dynamic(() =>
  import('@repo/components/src/templates/profile-privated.tsx')
    .then(m => m.ProfilePrivated),
);

const UserProfileGameAchievements = dynamic(() =>
  import('@repo/components/src/profile/components/achievements/components/profile-game-ach.tsx')
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
  requestedUser: RequestedUser;
  currentUser: User;
};

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { nickname } = params;
  return {
    title: nickname ?? "Загрузка...",
    description: `Профиль игрока ${nickname}`,
    keywords: [nickname ?? "player", `fasberry profile player`, `${nickname} profile`,],
  };
}

const ProfileContentPage = async ({
  requestedUser, currentUser,
}: ProfileContentPageProps) => {
  const { nickname: currentUserNickname } = currentUser;
  const { game_stats_visible } = requestedUser.preferences;
  const requestedUserUUID = requestedUser.uuid;
  const requestedUserNickname = requestedUser.nickname;

  const isOwner = currentUserNickname === requestedUserNickname;

  let isGameStatsShow: boolean;

  if (isOwner) {
    isGameStatsShow = true;
  } else {
    isGameStatsShow = game_stats_visible;
  }

  const isSectionPrivatedByOwner = !game_stats_visible && requestedUserNickname === currentUserNickname;

  return (
    <Tabs
      id="main-content"
      defaultValue="posts"
      className="flex flex-col w-full h-full lg:px-12 gap-y-6 pt-6 min-w-[380px] relative z-[4]"
    >
      <TabsList className="grid grid-cols-2 auto-rows-auto lg:flex lg:justify-start gap-2 w-full">
        <TabsTrigger value="posts">Посты</TabsTrigger>
        <TabsTrigger value="topics">Треды</TabsTrigger>
        <TabsTrigger value="friends">Друзья</TabsTrigger>
        <Separator orientation="vertical" className="hidden lg:block" />
        {isGameStatsShow && (
          <>
            <TabsTrigger value="game-stats" className="peer">
              Статистика
            </TabsTrigger>
            {isSectionPrivatedByOwner && <SectionPrivatedTrigger />}
          </>
        )}
        <TabsTrigger value="achievements">Достижения</TabsTrigger>
        {isOwner && (
          <>
            <Separator orientation="vertical" className="hidden lg:block" />
            <TabsTrigger value="account-stats" className="peer">
              Аккаунт
            </TabsTrigger>
            <SectionPrivatedTrigger />
          </>
        )}
      </TabsList>
      <div className="flex flex-col mt-24 lg:mt-0 lg:flex-row items-start gap-12 w-full">
        <div className="flex grow *:w-full w-full">
          <Suspense fallback={<UserPostsSkeleton />}>
            <TabsContent value="posts">
              <UserProfilePosts nickname={requestedUserNickname} />
            </TabsContent>
          </Suspense>
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
        <div className="hidden lg:flex flex-col w-1/3 h-full">
          <UserProfileSkin uuid={requestedUserUUID} />
        </div>
      </div>
    </Tabs>
  );
};

export default async function ProfilePage({
  params
}: PageConventionProps) {
  const { nickname: requestedUserNickname } = params;
  if (!requestedUserNickname) return;

  const requestedUser = await getRequestedUser(requestedUserNickname);
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser || !requestedUser) return;

  const profileStatus = await checkProfileStatus(requestedUser);

  if (profileStatus?.is_banned) {
    const banDetails = await getBanDetails({ nickname: requestedUserNickname });
    return <UserBanned {...banDetails} />;
  }

  const isBlocked = profileStatus?.is_blocked ?? "none";
  const isPrivated = profileStatus?.is_private ?? false

  if (!profileStatus?.is_viewed) {
    await delay(5000, await createProfileView(requestedUserNickname))
  }

  return (
    <div className="flex flex-col w-full relative">
      <Suspense fallback={<UserCoverSkeleton />}>
        <UserCoverLayout requestedUserNickname={requestedUserNickname} />
      </Suspense>
      {(isBlocked !== 'none') ? (
        <UserBlocked blockedType={isBlocked} />
      ) : (
        isPrivated
          ? <ProfilePrivated />
          : <ProfileContentPage requestedUser={requestedUser} currentUser={currentUser} />
      )}
    </div>
  );
}