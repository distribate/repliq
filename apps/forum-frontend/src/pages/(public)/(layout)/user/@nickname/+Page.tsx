import { UserCoverLayout } from '#components/profile/header/components/cover-layout.tsx'
import { 
  defineUserAction, 
  requestedUserAccountTypeAtom, 
  requestedUserParamAtom, 
  requestedUserProfileBlockedAtom, 
  requestedUserProfileStatusAtom 
} from '#components/profile/main/models/requested-user.model'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { lazy, Suspense } from 'react'
import { ProfileContentTabs } from '#components/profile/main/components/profile-main'
import { useData } from "vike-react/useData"
import { Data } from './+data'

const Blocked = lazy(() => import("#components/templates/components/user-blocked").then(m => ({ default: m.UserBlocked })));
const Banned = lazy(() => import("#components/templates/components/user-banned").then(m => ({ default: m.UserBanned })));
const Deleted = lazy(() => import("#components/templates/components/user-deleted").then(m => ({ default: m.UserDeleted })))

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
          <Blocked type={ctx.spy(requestedUserProfileBlockedAtom)!} />
        </Suspense>
      )
    default:
      return (
        <ProfileContentTabs />
      )
  }
}, "RouteComponent")