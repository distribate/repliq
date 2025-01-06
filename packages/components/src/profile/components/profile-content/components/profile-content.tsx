"use client"

import { useUserProfile } from "../hooks/use-user-profile"
import { profileStatusQuery } from "../queries/profile-status-query"
import { useEffect } from "react"
import { ProfileContentTabs } from "./profile-content-tabs"
import dynamic from 'next/dynamic';

const UserBanned = dynamic(() =>
  import('@repo/components/src/templates/user-banned.tsx')
    .then(m => m.UserBanned),
);

const UserBlocked = dynamic(() =>
  import('@repo/components/src/templates/user-blocked.tsx')
    .then(m => m.UserBlocked),
);

const ProfilePrivated = dynamic(() =>
  import('@repo/components/src/templates/profile-privated.tsx')
    .then(m => m.ProfilePrivated),
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

  return isPrivate ? <ProfilePrivated /> : <ProfileContentTabs requestedUserNickname={requestedUserNickname} />
}