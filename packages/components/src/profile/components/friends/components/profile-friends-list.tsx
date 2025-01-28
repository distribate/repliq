import { FilteredNotFound } from "#templates/filtered-not-found.tsx";
import { friendsQuery } from "#friends/queries/friends-query.ts";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { FriendProfileCard } from "#friend/components/friend-card/components/friend-profile-card.tsx";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { ProfileFriendsFiltering } from "#profile/components/friends/components/profile-friends-filtering.tsx";
import { type FriendWithDetails } from '@repo/types/schemas/friend/friend-types';
import { Suspense } from "react";
import { ProfileFriendsSkeleton } from "./profile-friends-skeleton";
import { SomethingError } from "#templates/something-error.tsx";

const filterFriendsByNickname = (data: FriendWithDetails[], querySearch: string) =>
  data.filter(item => item.nickname.startsWith(querySearch));

const ProfileFriendsList = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { sort_type, ascending } = friendsSortQuery().data;
  const { data, isLoading, isError } = friendsQuery({ nickname, sort_type, ascending, limit: 32 });
  const { searchQuery } = friendsSortQuery().data;

  if (isLoading) return <ProfileFriendsSkeleton />;
  if (isError) return <SomethingError />;

  if (!data || !data.data || !data.data.length) {
    return <ContentNotFound title="Друзей нет" />
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
    <Suspense fallback={<ProfileFriendsSkeleton />}>
      <div className="flex flex-col gap-4 w-full h-full">
        <ProfileFriendsFiltering />
        <ProfileFriendsList nickname={nickname} />
      </div>
    </Suspense>
  );
};