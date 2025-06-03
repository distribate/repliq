import { lazy, Suspense } from "react"
import { UserContentSkeleton } from "#components/skeletons/components/user-profile-skeleton";
import { UserProfilePosts as Posts } from "#components/profile/posts/components/profile-posts";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from '@reatom/npm-react';
import {
  requestedUserSectionIsPrivatedAtom,
  requestedUserAction,
  requestedUserGameStatsVisibleAtom,
  requestedUserIsSameAtom,
  requestedUserParamAtom,
  requestedUserProfileBlockedAtom,
  requestedUserProfileStatusAtom,
  requestedUserAccountTypeAtom,
  requestedUserMinecraftProfileIsExistsAtom
} from '#components/profile/main/models/requested-user.model';
import { SectionPrivatedTrigger } from '#components/templates/components/section-privated-trigger';
import { isAuthenticatedAtom } from '@repo/lib/queries/global-option-query';
import { AuthorizeTemplate } from '#components/templates/components/auth-template';

const Account = lazy(() => import("#components/profile/account/components/profile-account.tsx").then(m => ({ default: m.UserProfileAccount })))
const Friends = lazy(() => import("#components/profile/friends/components/profile-friends.tsx").then(m => ({ default: m.UserProfileFriends })))
const Threads = lazy(() => import("#components/profile/threads/components/profile-threads.tsx").then(m => ({ default: m.UserProfileThreads })))
const Blocked = lazy(() => import("#components/templates/components/user-blocked").then(m => ({ default: m.UserBlocked })));
const Banned = lazy(() => import("#components/templates/components/user-banned").then(m => ({ default: m.UserBanned })));
const Deleted = lazy(() => import("#components/templates/components/user-deleted").then(m => ({ default: m.UserDeleted })))
const Minecraft = lazy(() => import("#components/profile/minecraft/minecraft").then(m => ({ default: m.Minecraft })));

export const Page = reatomComponent(({ ctx }) => {
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
          <Blocked blockedType={ctx.spy(requestedUserProfileBlockedAtom)!} />
        </Suspense>
      )
    default:
      return (
        <ProfileContentTabs />
      )
  }
}, "RouteComponent")

const TabsListContent = reatomComponent(({ ctx }) => {
  return (
    <>
      <TabsTrigger value="posts">
        <Typography className="font-semibold">Посты</Typography>
      </TabsTrigger>
      <TabsTrigger value="threads">
        <Typography className="font-semibold">Треды</Typography>
      </TabsTrigger>
      <TabsTrigger value="friends">
        <Typography className="font-semibold">Друзья</Typography>
      </TabsTrigger>
      {ctx.spy(requestedUserMinecraftProfileIsExistsAtom) && (
        ctx.spy(requestedUserGameStatsVisibleAtom) && (
          <>
            <Separator orientation="vertical" className="hidden lg:block" />
            <TabsTrigger value="minecraft">
              <Typography className="font-semibold">Minecraft</Typography>
            </TabsTrigger>
            {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
          </>
        )
      )}
      {ctx.spy(requestedUserIsSameAtom) && (
        <>
          <Separator orientation="vertical" className="hidden lg:block" />
          <TabsTrigger value="account">
            <Typography className="font-semibold">Аккаунт</Typography>
          </TabsTrigger>
          {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
        </>
      )}
    </>
  )
}, "TabsListContent")

export const ProfileContentTabs = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  if (ctx.spy(requestedUserAction.statusesAtom).isPending) {
    return <UserContentSkeleton />
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-12 h-full lg:px-16 relative z-[4]">
      <Tabs defaultValue="posts" className="flex flex-col gap-6 w-full h-full">
        <TabsList className="md:hidden flex items-center no-scrollbar justify-start px-2 py-4 overflow-x-auto bg-shark-900 w-full">
          <TabsListContent />
        </TabsList>
        <TabsList className="hidden md:flex justify-start p-2 gap-2 w-fit bg-shark-900">
          <TabsListContent />
        </TabsList>
        <div className="flex flex-col lg:flex-row items-start grow *:w-full w-full">
          <TabsContent value="posts">
            {isAuthenticated ? (
              <Posts />
            ) : <AuthorizeTemplate />}
          </TabsContent>
          <TabsContent value="threads">
            {isAuthenticated ? (
              <Suspense>
                <Threads />
              </Suspense>
            ) : <AuthorizeTemplate />}
          </TabsContent>
          <TabsContent value="friends">
            {isAuthenticated && (
              <Suspense>
                <Friends />
              </Suspense>
            )}
            {!isAuthenticated && <AuthorizeTemplate />}
          </TabsContent>
          <TabsContent value="minecraft">
            {ctx.spy(requestedUserMinecraftProfileIsExistsAtom) && (
              isAuthenticated ? (
                <Suspense>
                  <Minecraft />
                </Suspense>
              ) : <AuthorizeTemplate />
            )}
          </TabsContent>
          <TabsContent value="account">
            {isAuthenticated ? (
              ctx.spy(requestedUserIsSameAtom) && (
                <Suspense>
                  <Account />
                </Suspense>
              )
            ) : <AuthorizeTemplate />}
          </TabsContent>
        </div >
      </Tabs >
    </div >
  );
}, "ProfileContentTabs")