import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCard } from "#components/friend/components/friend-card/friend-card.tsx";
import {
  FriendsViewer,
  myFriendsAction,
  myFriendsDataAtom,
  myFriendsNotPinnedDataAtom,
  myFriendsPinnedDataAtom,
  updateFriendsAction
} from "#components/friends/models/friends.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { SectionSkeleton } from "#components/templates/components/section-skeleton.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

const FriendCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 w-full min-h-[112px] bg-shark-950 border border-shark-800 rounded-lg p-4">
      <Skeleton className="rounded-lg w-[112px] h-[112px]" />
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <div className="flex items-center gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center w-fit">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
    </div>
  );
};

const FriendsAllListSkeleton = () => {
  return (
    <>
      <FriendCardSkeleton />
      <FriendCardSkeleton />
      <FriendCardSkeleton />
      <FriendCardSkeleton />
    </>
  );
};

const UpdatedSkeleton = reatomComponent(({ ctx }) => {
  const isLoadingUpdated = ctx.spy(updateFriendsAction.statusesAtom).isPending
  if (!isLoadingUpdated) return null;

  return <FriendsAllListSkeleton />
}, "UpdatedSkeleton")

const List = reatomComponent(({ ctx }) => {
  const data = ctx.spy(myFriendsDataAtom);
  const isExist = data && data.length >= 1

  if (!isExist) {
    return <ContentNotFound title="Пока нет друзей" />
  }

  const pinnedData = ctx.spy(myFriendsPinnedDataAtom)
  const notPinnedData = ctx.spy(myFriendsNotPinnedDataAtom)

  return (
    <>
      {pinnedData.map(friend => <FriendCard key={friend.nickname} {...friend} />)}
      {notPinnedData.map(friend => <FriendCard key={friend.nickname} {...friend} />)}
      <UpdatedSkeleton />
      <FriendsViewer />
    </>
  )
}, "List")

export const FriendsAllList = reatomComponent(({ ctx }) => {
  if (ctx.spy(myFriendsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  return (
    <FriendsListLayout>
      <List />
    </FriendsListLayout>
  );
}, "FriendsAllList")