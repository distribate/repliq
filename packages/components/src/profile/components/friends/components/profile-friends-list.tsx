"use client";

import { FilteredNotFound } from "#templates/filtered-not-found.tsx";
import { RequestFriends, UserFriends } from "#friends/queries/get-friends.ts";
import {
  FRIENDS_QUERY_KEY,
  friendsQuery,
} from "#friends/queries/friends-query.ts";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { FriendProfileCard } from "#friend/components/friend-card/components/friend-profile-card.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { ProfileFriendsFiltering } from "#profile/components/friends/components/profile-friends-filtering.tsx";

const SomethingError = dynamic(() =>
  import("#templates/something-error.tsx").then((m) => m.SomethingError),
);

type FriendsSearch = Pick<UserEntity, "nickname" | "name_color">;

type FriendsListLayoutProps = {
  friends: UserFriends[];
};

const filterFriendsByNickname = (data: FriendsSearch[], querySearch: string) =>
  data.filter((item) => item.nickname.startsWith(querySearch));

const ProfileFriendsList = ({ friends }: FriendsListLayoutProps) => {
  const { data: friendsSortState } = friendsSortQuery();

  const filteredfriends = friendsSortState.querySearch
    ? filterFriendsByNickname(friends, friendsSortState.querySearch)
    : friends;

  if (filteredfriends && !filteredfriends.length) {
    return <FilteredNotFound value={friendsSortState.querySearch || ""} />;
  }

  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
      {filteredfriends.map((friend, i) => (
        <FriendProfileCard
          key={i}
          nickname={friend.nickname}
          name_color={friend.name_color}
        />
      ))}
    </div>
  );
};

const ProfileFriendsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <Skeleton className="h-10 w-36" />
        <div className="flex items-center gap-4 w-fit">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid auto-rows-auto grid-cols-3 gap-2 w-full">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>
    </div>
  );
};

export const ProfileFriends = ({ nickname }: RequestFriends) => {
  const qc = useQueryClient();

  const currentFriends = qc.getQueryData<UserFriends[]>(
    FRIENDS_QUERY_KEY(nickname),
  );

  const {
    data: fetchedFriends,
    isLoading,
    isError,
  } = friendsQuery({
    nickname,
    enabled: !currentFriends,
  });

  if (isLoading) return <ProfileFriendsSkeleton />;
  if (isError) return <SomethingError />;

  const friendsData = currentFriends || fetchedFriends;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {friendsData && <ProfileFriendsFiltering />}
      {!friendsData && <ContentNotFound title="Друзей нет" />}
      {friendsData && <ProfileFriendsList friends={friendsData} />}
    </div>
  );
};
