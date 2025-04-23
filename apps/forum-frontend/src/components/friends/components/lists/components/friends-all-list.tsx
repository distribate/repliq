import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCard } from "#components/friend/components/friend-card/components/friend-card.tsx";
import { friendsQuery } from "#components/friends/queries/friends-query.ts";
import { friendsFilteringQuery } from "#components/friends/components/filtering/queries/friends-filtering-query.ts";
import { FriendsAllListSkeleton } from "#components/skeletons/components/friends-all-list-skeleton.tsx";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import { UPDATE_FRIENDS_MUTATION_KEY, useUpdateFriends } from "#components/friends/hooks/use-update-friends.ts";
import { useInView } from "react-intersection-observer";
import { useMutationState } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const FriendsAllList = () => {
  const { nickname } = getUser();
  const { data: { viewType } } = friendsFilteringQuery();
  const { data: friends, isLoading } = friendsQuery({ nickname });
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

  useEffect(() => {
    if (inView && hasMore) updateFriendsMutation.mutate({ with_details: true, nickname, type: "update-cursor" });
  }, [inView, hasMore]);

  if (isLoading) return <FriendsAllListSkeleton />

  if (!friendsData.length) return <ContentNotFound title="Пока нет друзей" />

  const pinnedFriends = friendsData.filter(f => f.is_pinned);
  const notPinnedFriends = friendsData.filter(f => !f.is_pinned);

  return (
    <FriendsListLayout variant={viewType}>
      {pinnedFriends.map(f => <FriendCard key={f.nickname} {...f} />)}
      {notPinnedFriends.map(f => <FriendCard key={f.nickname} {...f} />)}
      {isLoadingUpdated && <FriendsAllListSkeleton />}
      {hasMore && <div ref={ref} className="h-[1px] w-full" />}
    </FriendsListLayout>
  );
}