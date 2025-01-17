"use client"

import { useUserProfile } from "../hooks/use-user-profile"
import { profileStatusQuery } from "../queries/profile-status-query"
import { useEffect } from "react"
import { ProfileContentTabs } from "./profile-content-tabs"
import { ProfilePrivated } from "#templates/profile-privated.tsx"
import { UserBlocked } from "#templates/user-blocked.tsx"
import { UserBanned } from "#templates/user-banned.tsx"

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