import { ContentNotFound } from "#templates/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCard } from "#friend/components/friend-card/components/friend-card.tsx";
import { friendsQuery } from "#friends/queries/friends-query.ts";
import { friendsFilteringQuery } from "#friends/components/filtering/queries/friends-filtering-query.ts";
import { FriendCardSkeleton, FriendsAllListSkeleton } from "#skeletons/friends-all-list-skeleton.tsx";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import { UPDATE_FRIENDS_MUTATION_KEY, useUpdateFriends } from "#friends/hooks/use-update-friends.ts";
import { useInView } from "react-intersection-observer";
import { useMutationState } from "@tanstack/react-query";
import { useEffect } from "react";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const FriendsAllList = () => {
  const { nickname } = getUser();
  const { data: { viewType } } = friendsFilteringQuery();
  const { data: { sort_type, ascending } } = friendsSortQuery()
  const { data: friends, isLoading } = friendsQuery({ nickname, sort_type, ascending });
  const { updateFriendsMutation } = useUpdateFriends()
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const mutData = useMutationState({
    filters: { mutationKey: UPDATE_FRIENDS_MUTATION_KEY },
    select: m => m.state.status
  })

  const isLoadingUpdated = mutData[mutData.length - 1] === "pending";
  const friendsData = friends?.data as FriendWithDetails[]
  const friendsMeta = friends?.meta;
  const hasMore = friendsMeta?.hasNextPage;
  const cursor = friendsMeta?.endCursor;

  useEffect(() => {
    if (inView && hasMore) updateFriendsMutation.mutate({ cursor, with_details: true })
  }, [inView, hasMore]);

  if (isLoading) return <FriendsAllListSkeleton />

  if (!friendsData.length) {
    return <ContentNotFound title="Пока нет друзей ;(" />
  }

  const pinnedFriends = friendsData.filter(f => f.is_pinned);
  const notPinnedFriends = friendsData.filter(f => !f.is_pinned);

  return (
    <FriendsListLayout variant={viewType}>
      {pinnedFriends.map(friend => (
        <FriendCard key={friend.nickname} {...friend} />
      ))}
      {notPinnedFriends.map(friend => (
        <FriendCard key={friend.nickname} {...friend} />
      ))}
      {isLoadingUpdated && (
        <div className="flex flex-col items-start gap-y-2 w-full">
          <FriendCardSkeleton />
          <FriendCardSkeleton />
          <FriendCardSkeleton />
        </div>
      )}
      {hasMore && <div ref={ref} className="h-[1px] w-full" />}
    </FriendsListLayout>
  );
}