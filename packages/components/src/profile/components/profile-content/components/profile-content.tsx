import { useUserProfile } from "../hooks/use-user-profile"
import { profileStatusQuery } from "../queries/profile-status-query"
import { lazy, Suspense, useEffect } from "react"
import { ProfileContentTabs } from "./profile-content-tabs"

const UserBlocked = lazy(() => import("#templates/user-blocked.tsx")
  .then(m => ({ default: m.UserBlocked }))
);

const UserBanned = lazy(() => import("#templates/user-banned.tsx")
  .then(m => ({ default: m.UserBanned }))
);

const ProfilePrivated = lazy(() => import("#templates/profile-privated.tsx")
  .then(m => ({ default: m.ProfilePrivated }))
);

export type ProfileContentProps = {
  requestedUserNickname: string
}

export const ProfileContent = ({
  requestedUserNickname
}: ProfileContentProps) => {
  const { createProfileViewMutation } = useUserProfile()
  const { data: profileStatus } = profileStatusQuery(requestedUserNickname)

  useEffect(() => {
    if (!profileStatus?.is_viewed) {
      createProfileViewMutation.mutate(requestedUserNickname)
    }
  }, [profileStatus?.is_viewed]);

  if (profileStatus?.status === 'banned') {
    return <UserBanned requestedUserNickname={requestedUserNickname} />;
  }

  const blockedType = profileStatus?.status === 'blocked-by-you' ? 'blocked-by-you' : 'blocked-by-user'
  const isBlocked = (profileStatus?.status === 'blocked-by-you' || profileStatus?.status === 'blocked-by-user')
  const isPrivate = profileStatus?.status === 'private'

  if (isBlocked) {
    return <UserBlocked blockedType={blockedType} />
  }

  return isPrivate ? (
    <Suspense fallback={null}>
      <ProfilePrivated />
    </Suspense>
  ) : (
    <Suspense fallback={null}>
      <ProfileContentTabs requestedUserNickname={requestedUserNickname} />
    </Suspense>
  )
}