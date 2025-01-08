"use client";

import { FilteredNotFound } from "#templates/filtered-not-found.tsx";
import {
  friendsQuery,
} from "#friends/queries/friends-query.ts";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { FriendProfileCard } from "#friend/components/friend-card/components/friend-profile-card.tsx";
import dynamic from "next/dynamic";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { ProfileFriendsFiltering } from "#profile/components/friends/components/profile-friends-filtering.tsx";
import { type FriendWithDetails } from '@repo/types/schemas/friend/friend-types';
import { Suspense } from "react";
import { ProfileFriendsSkeleton } from "./profile-friends-skeleton";

const SomethingError = dynamic(() =>
  import("#templates/something-error.tsx").then((m) => m.SomethingError),
);

type FriendsListLayoutProps = {
  friends: FriendWithDetails[];
};

const filterFriendsByNickname = (data: FriendWithDetails[], querySearch: string) =>
  data.filter(item => item.nickname.startsWith(querySearch));

const ProfileFriendsList = ({ friends }: FriendsListLayoutProps) => {
  const { searchQuery } = friendsSortQuery().data;

  const filteredfriends = searchQuery && searchQuery.length > 0
    ? filterFriendsByNickname(friends, searchQuery)
    : friends;

  if (filteredfriends && !filteredfriends.length) {
    return <FilteredNotFound value={searchQuery} />;
  }

  return (
    <div className="grid auto-rows-auto grid-cols-1 lg:grid-cols-3 gap-2 w-full">
      {filteredfriends.map(friend =>
        <FriendProfileCard key={friend.nickname} {...friend} />
      )}
    </div>
  );
};

export const ProfileFriends = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { sort_type, ascending } = friendsSortQuery().data;
  const { data: friends, isLoading, isError } = friendsQuery({ nickname, sort_type, ascending });

  if (isLoading) return <ProfileFriendsSkeleton />;
  if (isError) return <SomethingError />;
  if (!friends) return <ContentNotFound title="Друзей нет" />;

  return (
    <Suspense fallback={<ProfileFriendsSkeleton />}>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfileFriendsFiltering />
        <ProfileFriendsList friends={friends.data as FriendWithDetails[]} />
      </div>
    </Suspense>
  );
};