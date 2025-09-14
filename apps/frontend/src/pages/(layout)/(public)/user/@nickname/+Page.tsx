import { HeadLayout } from '#components/profile/components/head/components/head-layout'
import {
  defineUser,
  isParamChanged,
  requestedUserAccountTypeAtom,
  requestedUserIsSameAtom,
  requestedUserParamAtom,
  requestedUserProfileBlockedAtom,
  requestedUserProfilesIsExistAtom,
  requestedUserProfileStatusAtom,
  requestedUserSectionIsPrivatedAtom
} from '#components/profile/models/requested-user.model'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { useData } from "vike-react/useData"
import { Data } from './+data'
import { clientOnly } from 'vike-react/clientOnly'
import { isAuthenticatedAtom } from '#components/auth/models/auth.model'
import { AuthorizeTemplate } from '#components/templates/components/auth-template'
import { cva } from 'class-variance-authority'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/src/components/tabs'
import {
  IconApps,
  IconBrandThreads,
  IconCardboardsFilled,
  IconPencilShare,
  IconUsers
} from "@tabler/icons-react";
import { Typography } from '@repo/ui/src/components/typography'
import { Separator } from '@repo/ui/src/components/separator'
import { UserProfileIntegrations } from '#components/profile/components/integrations/minecraft/components/integrations'
import { SectionPrivatedTrigger } from '#components/templates/components/section-privated-trigger'
import { UserProfilePosts } from '#components/profile/components/posts/components/profile-posts'
import { atom } from '@reatom/core'
import { withReset } from '@reatom/framework'
import { log } from '#shared/utils/log'

const Blocked = clientOnly(() => import("#components/templates/components/user-blocked").then(m => m.UserBlocked));
const Banned = clientOnly(() => import("#components/templates/components/user-banned").then(m => m.UserBanned));
const Deleted = clientOnly(() => import("#components/templates/components/user-deleted").then(m => m.UserDeleted))
const Privated = clientOnly(() => import("#components/templates/components/profile-privated").then(m => m.ProfilePrivated));

const UserProfileAccount = clientOnly(() => import("#components/profile/components/account/components/profile-account.tsx").then(m => m.UserProfileAccount))
const UserProfileFriends = clientOnly(() => import("#components/profile/components/friends/components/profile-friends").then(m => m.UserProfileFriends))
const UserProfileThreads = clientOnly(() => import("#components/profile/components/threads/components/profile-threads").then(m => m.UserProfileThreads))

const iconVariant = cva(`group-data-[state=active]:text-shark-950 group-data-[state=inactive]:text-shark-300`)

const ProfileTabsListContent = reatomComponent(({ ctx }) => {
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
          <TabsTrigger value="integrations" className="group gap-2">
            <IconApps
              size={20}
              className={iconVariant()}
            />
            <Typography className="font-semibold">Интеграции</Typography>
          </TabsTrigger>
          {ctx.spy(requestedUserSectionIsPrivatedAtom) && <SectionPrivatedTrigger />}
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

const profileContentTabValueAtom = atom<string>("posts", "profileContentTabValue").pipe(withReset())

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  profileContentTabValueAtom.reset(ctx)
  log("profileContentTabValueAtom reset")
}))

const ProfileTabsContent = reatomComponent(({ ctx }) => {
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
          <ProfileTabsListContent />
        </TabsList>
        <TabsList className="hidden *:rounded-lg rounded-lg gap-2 md:flex justify-start w-fit">
          <ProfileTabsListContent />
        </TabsList>
        <div className="flex flex-col lg:flex-row items-start grow *:w-full w-full">
          <TabsContent value="posts">
            <UserProfilePosts />
          </TabsContent>
          <TabsContent value="threads">
            <UserProfileThreads />
          </TabsContent>
          <TabsContent value="friends">
            <UserProfileFriends />
          </TabsContent>
          {ctx.spy(requestedUserProfilesIsExistAtom) && (
            <TabsContent value="integrations">
              <UserProfileIntegrations />
            </TabsContent>
          )}
          {ctx.spy(requestedUserIsSameAtom) && (
            <TabsContent value="account">
              <UserProfileAccount />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}, "ProfileContentTabs")

const Sync = () => {
  const { data, nickname: target } = useData<Data>();
  useUpdate((ctx) => defineUser(ctx, data), [target])
  return null
}

const Profile = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)
  const templateTitle = "Для просмотра профиля необходимо авторизоваться."

  const accountType = ctx.spy(requestedUserAccountTypeAtom)

  switch (accountType) {
    case "archived":
    case "deleted":
      return <Deleted />;
  }

  const status = ctx.spy(requestedUserProfileStatusAtom)

  if (status === 'banned') {
    return <Banned nickname={ctx.spy(requestedUserParamAtom)} />
  }

  if (!isAuthenticated) {
    return <AuthorizeTemplate title={templateTitle} />
  }

  if (status === 'blocked') {
    return <Blocked type={ctx.spy(requestedUserProfileBlockedAtom)!} />
  }

  if (status === 'privated') {
    return <Privated />
  }

  return <ProfileTabsContent />
}, "Profile")

export default function Page() {
  return (
    <>
      <Sync />
      <div className="flex flex-col gap-6 w-full h-full relative">
        <HeadLayout>
          <Profile />
        </HeadLayout>
      </div>
    </>
  )
}