import { requestedUserQuery } from "#profile/components/cover/queries/requested-user-query.ts";
import { UserProfilePosts } from "#profile/components/posts/components/posts/components/profile-posts.tsx";
import { UserPostsSkeleton } from "#skeletons/user-posts-skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { Suspense } from "react";
import { Selectable } from 'kysely';
import { Users } from "@repo/types/db/forum-database-types";
import { ProfileContentProps } from "./profile-content";
import { ProfileSkinControls } from "#profile/components/skin/components/profile-skin-controls.tsx";
import { ProfileSkinRender } from "#profile/components/skin/components/profile-skin-render.tsx";
import { lazy } from "react";

const UserProfileAccount = lazy(() => import("#profile/components/account-stats/components/profile-account.tsx")
  .then(m => ({ default: m.UserProfileAccount }))
)

const UserProfileGameStats = lazy(() => import("#profile/components/stats/components/profile-stats.tsx")
  .then(m => ({ default: m.UserProfileGameStats }))
)

const UserProfileFriends = lazy(() => import("#profile/components/friends/components/profile-friends.tsx")
  .then(m => ({ default: m.UserProfileFriends }))
)

const UserProfileThreads = lazy(() => import("#profile/components/threads/components/profile-threads.tsx")
  .then(m => ({ default: m.UserProfileThreads }))
)

const UserProfileGameAchievements = lazy(() => import("#profile/components/achievements/components/profile-game-ach.tsx")
  .then(m => ({ default: m.UserProfileGameAchievements }))
)

const SectionPrivatedTrigger = lazy(() => import("#templates/section-privated-trigger.tsx")
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
        <div className="hidden 2xl:flex h-[500px] flex-col w-1/3">
          <div className="flex flex-col h-full w-full gap-4">
            <ProfileSkinControls nickname={requestedUserNickname} />
            <ProfileSkinRender nickname={requestedUserNickname} />
          </div>
        </div>
      </div>
    </Tabs>
  );
};