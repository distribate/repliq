import { UserContentSkeleton } from "#components/skeletons/components/user-profile-skeleton";
import { UserProfilePosts as Posts } from "#components/profile/posts/components/profile-posts";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from '@reatom/npm-react';
import {
  requestedUserSectionIsPrivatedAtom,
  defineUserAction,
  requestedUserGameStatsVisibleAtom,
  requestedUserIsSameAtom,
  requestedUserMinecraftProfileIsExistsAtom
} from '#components/profile/main/models/requested-user.model';
import { SectionPrivatedTrigger } from '#components/templates/components/section-privated-trigger';
import { AuthorizeTemplate } from '#components/templates/components/auth-template';
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { clientOnly } from "vike-react/clientOnly";

const Account = clientOnly(() => import("#components/profile/account/components/profile-account.tsx").then(m => m.UserProfileAccount))
const Friends = clientOnly(() => import("#components/profile/friends/components/profile-friends.tsx").then(m => m.UserProfileFriends))
const Threads = clientOnly(() => import("#components/profile/threads/components/profile-threads.tsx").then(m => m.UserProfileThreads))
const Minecraft = clientOnly(() => import("#components/profile/minecraft/minecraft").then(m => m.Minecraft));

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

  if (ctx.spy(defineUserAction.statusesAtom).isPending) {
    return <UserContentSkeleton />
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-12 h-full lg:px-16 relative z-[4]">
      <Tabs defaultValue="posts" className="flex flex-col gap-6 w-full h-full">
        <TabsList
          className="md:hidden flex *:rounded-xl rounded-xl 
            items-center no-scrollbar gap-1 justify-start px-2 py-4 overflow-x-auto bg-shark-950 w-full"
        >
          <TabsListContent />
        </TabsList>
        <TabsList className="hidden *:rounded-xl rounded-xl md:flex justify-start p-2 gap-2 w-fit bg-shark-950">
          <TabsListContent />
        </TabsList>
        <div className="flex flex-col lg:flex-row items-start grow *:w-full w-full">
          <TabsContent value="posts">
            {isAuthenticated ? <Posts /> : <AuthorizeTemplate />}
          </TabsContent>
          <TabsContent value="threads">
            {isAuthenticated ? <Threads /> : <AuthorizeTemplate />}
          </TabsContent>
          <TabsContent value="friends">
            {isAuthenticated ? <Friends /> : <AuthorizeTemplate />}
          </TabsContent>
          <TabsContent value="minecraft">
            {ctx.spy(requestedUserMinecraftProfileIsExistsAtom) && (
              isAuthenticated ? <Minecraft /> : <AuthorizeTemplate />
            )}
          </TabsContent>
          <TabsContent value="account">
            {isAuthenticated ? (ctx.spy(requestedUserIsSameAtom) && <Account />) : <AuthorizeTemplate />}
          </TabsContent>
        </div >
      </Tabs >
    </div >
  );
}, "ProfileContentTabs")