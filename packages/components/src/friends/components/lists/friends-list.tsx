"use client";

import { friendsFilteringQuery } from "#friends/components/filtering/queries/friends-filtering-query.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Suspense } from "react";
import { FriendsAllList } from "#friends/components/lists/friends-all-list.tsx";
import { FriendsAllListSkeleton } from "#skeletons/friends-all-list-skeleton.tsx";
import dynamic from "next/dynamic";

export type FriendsListProps = Pick<UserEntity, "nickname">;

const FriendsOutgoingList = dynamic(() =>
  import("#friends/components/lists/friends-outgoing-list.tsx").then(
    (m) => m.FriendsOutgoingList,
  ),
);

const FriendsIncomingList = dynamic(() =>
  import("#friends/components/lists/friends-incoming-list.tsx").then(
    (m) => m.FriendsIncomingList,
  ),
);

const FriendsSearchingList = dynamic(() =>
  import("#friends/components/lists/friends-searching-list.tsx").then(
    (m) => m.FriendsSearchingList,
  ),
);

export const FriendsList = ({ nickname }: FriendsListProps) => {
  const { data: friendsFilteringState } = friendsFilteringQuery();
  const currentListType = friendsFilteringState.listType;

  return (
    <Suspense fallback={<FriendsAllListSkeleton />}>
      {currentListType === "all" && <FriendsAllList nickname={nickname} />}
      {currentListType === "outgoing" && <FriendsOutgoingList />}
      {currentListType === "incoming" && <FriendsIncomingList />}
      {currentListType === "search" && <FriendsSearchingList />}
    </Suspense>
  );
};
