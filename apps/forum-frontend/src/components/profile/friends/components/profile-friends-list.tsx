import { FilteredNotFound } from "#components/templates/filtered-not-found.tsx";
import { friendsQuery } from "#components/friends/queries/friends-query.ts";
import { ContentNotFound } from "#components/templates/content-not-found.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { FriendProfileCard } from "#components/friend/components/friend-profile-card.tsx";
import { friendsSortQuery } from "#components/profile/friends/queries/friends-settings-query.ts";
import { ProfileFriendsFiltering } from "#components/profile/friends/components/profile-friends-filtering.tsx";
import { type FriendWithDetails } from '@repo/types/schemas/friend/friend-types';
import { Suspense } from "react";
import { ProfileFriendsSkeleton } from "./profile-friends-skeleton";
import { SomethingError } from "#components/templates/something-error.tsx";

const filterFriendsByNickname = (data: FriendWithDetails[], querySearch: string) =>
  data.filter(item => item.nickname.startsWith(querySearch));

const ProfileFriendsList = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { data, isLoading, isError } = friendsQuery({ nickname, limit: 32 });
  const { searchQuery } = friendsSortQuery().data;

  if (isLoading) return <ProfileFriendsSkeleton />;
  if (isError) return <SomethingError />;

  if (!data || !data.data || !data.data.length) {
    return <ContentNotFound title="Друзья не найдены" />
  }

  const friends = data.data as FriendWithDetails[]

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
  return (
    <Suspense>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfileFriendsFiltering nickname={nickname} />
        <ProfileFriendsList nickname={nickname} />
      </div>
    </Suspense>
  );
};