"use client";

import { ContentNotFound } from "#templates/content-not-found.tsx";
import { searchingFriends } from "#friends/queries/searching-friends-query.ts";
import { FriendsSearchingCard } from "#friends/components/searching/friends-searching-card.tsx";
import { FriendsAllListSkeleton } from "#skeletons/friends-all-list-skeleton.tsx";

export const FriendsSearchingList = () => {
  const { data: searchingUsers, isLoading } = searchingFriends();

  if (isLoading) return <FriendsAllListSkeleton />;

  if (!searchingUsers || (searchingUsers && searchingUsers.length === 0))
    return <ContentNotFound title="Пока никого не можем вам предложить ;(" />;

  return (
    <div className="grid grid-cols-3 auto-rows-auto gap-2 h-fit">
      {searchingUsers.map((user) => (
        <FriendsSearchingCard key={user.nickname} {...user} />
      ))}
    </div>
  );
};
