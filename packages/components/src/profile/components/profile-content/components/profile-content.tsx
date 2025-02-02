import { lazy, Suspense, useEffect } from "react"
import { ProfileContentTabs } from "./profile-content-tabs"
import { UserContentSkeleton } from "#skeletons/user-profile-skeleton.tsx";
import { requestedUserQuery } from "#profile/components/cover/queries/requested-user-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton";

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
  nickname: string
}

export const ProfileContent = ({
  nickname: requestedUserNickname
}: ProfileContentProps) => {
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname)

  const profileStatus = requestedUser?.details;

  if (profileStatus?.status === 'banned') {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <UserBanned requestedUserNickname={requestedUserNickname} />
      </Suspense>
    );
  }

  const blockedType = profileStatus?.status === 'blocked-by-you' ? 'blocked-by-you' : 'blocked-by-user';
  
  const isBlocked = (profileStatus?.status === 'blocked-by-you' 
    || profileStatus?.status === 'blocked-by-user')
    
  const isPrivate = profileStatus?.status === 'private'

  if (isBlocked) {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <UserBlocked blockedType={blockedType} />
      </Suspense>
    )
  }

  if (isPrivate) {
    return (
      <Suspense fallback={<Skeleton className="w-1/3 h-1/3" />}>
        <ProfilePrivated />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<UserContentSkeleton />}>
      <ProfileContentTabs nickname={requestedUserNickname} />
    </Suspense>
  )
}