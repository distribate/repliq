import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import {
  defineUser,
  requestedUserAccountTypeAtom,
  requestedUserParamAtom,
  requestedUserProfileBlockedAtom,
  requestedUserProfileStatusAtom
} from '#components/profile/main/models/requested-user.model'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { ProfileContentTabs } from '#components/profile/main/components/profile-main'
import { useData } from "vike-react/useData"
import { Data } from './+data'
import { clientOnly } from 'vike-react/clientOnly'
import { isAuthenticatedAtom } from '#components/auth/models/auth.model'
import { AuthorizeTemplate } from '#components/templates/components/auth-template'

const Blocked = clientOnly(() => import("#components/templates/components/user-blocked").then(m => m.UserBlocked));
const Banned = clientOnly(() => import("#components/templates/components/user-banned").then(m => m.UserBanned));
const Deleted = clientOnly(() => import("#components/templates/components/user-deleted").then(m => m.UserDeleted))
const Privated = clientOnly(() => import("#components/templates/components/profile-privated").then(m => m.ProfilePrivated));

const DefineUser = () => {
  const { data, nickname: target } = useData<Data>();
  useUpdate((ctx) => defineUser(ctx, data), [target])
  return null
}

export default function UserPage() {
  return (
    <>
      <DefineUser />
      <div className="flex flex-col gap-6 w-full h-full relative">
        <UserCoverLayout>
          <Page />
        </UserCoverLayout>
      </div>
    </>
  )
}

const Page = reatomComponent(({ ctx }) => {
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

  return <ProfileContentTabs />
}, "RouteComponent")