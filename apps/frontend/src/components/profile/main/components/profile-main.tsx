import { UserProfilePosts as Posts } from "#components/profile/posts/components/profile-posts";
import { Separator } from "@repo/ui/src/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from '@reatom/npm-react';
import {
  requestedUserSectionIsPrivatedAtom,
  requestedUserIsSameAtom,
  requestedUserParamAtom,
  isParamChanged,
  requestedUserProfilesAtom,
} from '#components/profile/main/models/requested-user.model';
import { SectionPrivatedTrigger } from '#components/templates/components/section-privated-trigger';
import { clientOnly } from "vike-react/clientOnly";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { IconApps, IconBrandThreads, IconCardboardsFilled, IconPencilShare, IconUsers } from "@tabler/icons-react";
import { cva } from "class-variance-authority";

const Account = clientOnly(() => import("#components/profile/account/components/profile-account.tsx").then(m => m.UserProfileAccount))
const Friends = clientOnly(() => import("#components/profile/friends/components/profile-friends.tsx").then(m => m.UserProfileFriends))
const Threads = clientOnly(() => import("#components/profile/threads/components/profile-threads.tsx").then(m => m.UserProfileThreads))
const Minecraft = clientOnly(() => import("#components/profile/integrations/minecraft/minecraft").then(m => m.Minecraft));

const iconVariant = cva(`group-data-[state=active]:text-shark-950 group-data-[state=inactive]:text-shark-300`)

const IntegrationsTrigger = reatomComponent(({ ctx }) => {
  return (
    <>
      <TabsTrigger value="minecraft" className="group gap-2">
        <IconApps
          size={20}
          className={iconVariant()}
        />
        <Typography className="font-semibold">Интеграции</Typography>
      </TabsTrigger>
      {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
    </>
  )
}, "IntegrationsTrigger")

const TabsListContent = reatomComponent(({ ctx }) => {
  return (
    <>
      <TabsTrigger value="posts" className="group gap-2 font-semibold">
        <IconPencilShare size={20} className={iconVariant()} />
        Посты
      </TabsTrigger>
      <TabsTrigger value="threads" className="group gap-2 font-semibold">
        <IconBrandThreads size={20} className={iconVariant()} />
        Треды
      </TabsTrigger>
      <TabsTrigger value="friends" className="group gap-2 font-semibold">
        <IconUsers size={20} className={iconVariant()} />
        Друзья
      </TabsTrigger>
      {ctx.spy(requestedUserProfilesIsExistAtom) && (
        <>
          <IntegrationsTrigger />
        </>
      )}
      {ctx.spy(requestedUserIsSameAtom) && (
        <>
          <Separator orientation="vertical" className="hidden lg:block" />
          <TabsTrigger value="account" className="group gap-2 font-semibold">
            <IconCardboardsFilled size={20} className={iconVariant()} />
            Аккаунт
          </TabsTrigger>
          {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
        </>
      )}
    </>
  )
}, "TabsListContent")

export const profileContentTabValueAtom = atom<string>("posts", "profileContentTabValue").pipe(withReset())

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  profileContentTabValueAtom.reset(ctx)
}))

const INTEGRATIONS: Record<string, (id: string) => React.ReactNode> = {
  "minecraft": (id: string) => <Minecraft nickname={id} />
}

const requestedUserProfilesIsExistAtom = atom((ctx) => {
  return ctx.spy(requestedUserProfilesAtom).length >= 1
}, "requestedUserProfilesIsExistAtom")

const Integrations = reatomComponent(({ ctx }) => {
  const values = ctx.spy(requestedUserProfilesAtom);

  return (
    values.map((item) => (
      <TabsContent key={item.type} value={item.type}>
        {INTEGRATIONS[item.type](item.value)}
      </TabsContent>
    ))
  )
}, "Integrations")

export const ProfileContentTabs = reatomComponent(({ ctx }) => {
  const integrationsIsExist = ctx.spy(requestedUserProfilesIsExistAtom)

  return (
    <div className="flex flex-col lg:flex-row w-full gap-12 h-full lg:px-16 relative z-[4]">
      <Tabs
        value={ctx.spy(profileContentTabValueAtom)}
        onValueChange={v => profileContentTabValueAtom(ctx, v)}
        defaultValue="posts"
        className="flex flex-col gap-6 w-full h-full"
      >
        <TabsList
          className="md:hidden flex *:rounded-lg rounded-lg 
            items-center gap-1 justify-start overflow-x-auto w-full"
        >
          <TabsListContent />
        </TabsList>
        <TabsList className="hidden *:rounded-lg rounded-lg gap-2 md:flex justify-start w-fit">
          <TabsListContent />
        </TabsList>
        <div className="flex flex-col lg:flex-row items-start grow *:w-full w-full">
          <TabsContent value="posts">
            <Posts />
          </TabsContent>
          <TabsContent value="threads">
            <Threads />
          </TabsContent>
          <TabsContent value="friends">
            <Friends />
          </TabsContent>
          {integrationsIsExist && <Integrations />}
          {ctx.spy(requestedUserIsSameAtom) && (
            <TabsContent value="account">
              <Account />
            </TabsContent>
          )}
        </div >
      </Tabs >
    </div >
  );
}, "ProfileContentTabs")