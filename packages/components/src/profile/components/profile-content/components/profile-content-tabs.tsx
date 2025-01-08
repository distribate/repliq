import { requestedUserQuery } from "#profile/components/cover/queries/requested-user-query.ts";
import { UserProfilePosts } from "#profile/components/posts/components/posts/components/profile-posts.tsx";
import { UserPostsSkeleton } from "#skeletons/user-posts-skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { Suspense } from "react";
import dynamic from 'next/dynamic';
import { Selectable } from 'kysely';
import { Users } from "@repo/types/db/forum-database-types";
import { ProfileContentProps } from "./profile-content";
import { UserDetailed } from "@repo/types/entities/user-type";

export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

const UserProfileAccountStats = dynamic(() =>
  import('@repo/components/src/profile/components/account-stats/components/profile-account.tsx')
    .then(m => m.UserProfileAccount),
);

const UserProfileGameAchievements = dynamic(() =>
  import('@repo/components/src/profile/components/achievements/components/profile-game-ach.tsx')
    .then(m => m.UserProfileGameAchievements),
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

const UserProfileSkin = dynamic(() =>
  import('@repo/components/src/profile/components/skin/components/profile-skin.tsx')
    .then(m => m.UserProfileSkin), {
  ssr: false
});

const SectionPrivatedTrigger = dynamic(() =>
  import('@repo/components/src/templates/section-privated-trigger.tsx')
    .then(m => m.SectionPrivatedTrigger),
);

export const ProfileContentTabs = ({
  requestedUserNickname
}: ProfileContentProps) => {
  const currentUser = getUser()
  const { data } = requestedUserQuery(requestedUserNickname)
  const { nickname: currentUserNickname } = currentUser;

  if (!data) return;

  const requestedUser = data as UserDetailed

  let requestedUserUUID: string | null = null;

  if (isUserDetailed(data)) {
    requestedUserUUID = data.uuid;
  }

  const { game_stats_visible } = requestedUser.preferences;
  const isOwner = currentUserNickname === requestedUserNickname;

  let isGameStatsShow: boolean;

  if (isOwner) {
    isGameStatsShow = true;
  } else {
    isGameStatsShow = game_stats_visible;
  }

  const isSectionPrivatedByOwner = !game_stats_visible && requestedUserNickname === currentUserNickname;

  if (!requestedUserUUID) return null;

  return (
    <Tabs
      id="main-content"
      defaultValue="posts"
      className="flex flex-col w-full h-full lg:px-12 gap-y-6 min-w-[380px] relative z-[4]"
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