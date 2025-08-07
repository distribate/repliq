import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import {
  defineUserAction,
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

const Blocked = clientOnly(() => import("#components/templates/components/user-blocked").then(m => m.UserBlocked));
const Banned = clientOnly(() => import("#components/templates/components/user-banned").then(m => m.UserBanned));
const Deleted = clientOnly(() => import("#components/templates/components/user-deleted").then(m => m.UserDeleted))

const DefineUser = () => {
  const { data, nickname: target } = useData<Data>();
  useUpdate((ctx) => defineUserAction(ctx, data), [target])
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
  switch (ctx.spy(requestedUserAccountTypeAtom)) {
    case "archived":
    case "deleted":
      return <Deleted />;
  }

  switch (ctx.spy(requestedUserProfileStatusAtom)) {
    case "banned":
      return <Banned requestedUserNickname={ctx.spy(requestedUserParamAtom)} />;
    case "blocked":
      return <Blocked type={ctx.spy(requestedUserProfileBlockedAtom)!} />
    default:
      return <ProfileContentTabs />
  }
}, "RouteComponent")