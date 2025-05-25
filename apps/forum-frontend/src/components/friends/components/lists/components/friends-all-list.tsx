import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { FriendCard } from "#components/friend/components/friend-card/friend-card.tsx";
import {
  myFriendsAction,
  myFriendsDataAtom,
  myFriendsMetaAtom,
  myFriendsNotPinnedDataAtom,
  myFriendsPinnedDataAtom
} from "#components/friends/models/friends.model.ts";
import { FriendsAllListSkeleton } from "#components/skeletons/components/friends-all-list-skeleton.tsx";
import { updateFriendsAction } from "#components/friends/models/update-friends.model.ts";
import { useInView } from "react-intersection-observer";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { onConnect, onDisconnect } from "@reatom/framework";

onConnect(myFriendsAction, myFriendsAction)

onDisconnect(myFriendsDataAtom, myFriendsDataAtom.reset)
onDisconnect(myFriendsMetaAtom, myFriendsMetaAtom.reset)

const SyncInView = ({ inView }: { inView: boolean }) => {
  useUpdate((ctx) => {
    const hasMore = ctx.get(myFriendsMetaAtom)?.hasNextPage

    if (inView && hasMore) updateFriendsAction(ctx, "update-cursor");
  }, [inView])

  return null;
}

const List = reatomComponent(({ ctx }) => {
  return (
    <>
      {ctx.spy(myFriendsPinnedDataAtom).map(target => (
        <FriendCard key={target.nickname} {...target} />
      ))}
      {ctx.spy(myFriendsNotPinnedDataAtom).map(target => (
        <FriendCard key={target.nickname} {...target} />
      ))}
      {ctx.spy(updateFriendsAction.statusesAtom).isPending && (
        <FriendsAllListSkeleton />
      )}
      <InViewer />
    </>
  )
})

const InViewer = () => {
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  return (
    <>
      <SyncInView inView={inView} />
      <div ref={ref} className="h-[1px] w-full" />
    </>
  )
}

export const FriendsAllList = reatomComponent(({ ctx }) => {
  const isLoading = ctx.spy(myFriendsAction.statusesAtom).isPending
  const data = ctx.spy(myFriendsDataAtom);

  return (
    <FriendsListLayout>
      {isLoading ? <FriendsAllListSkeleton /> : (
        data.length >= 1 ? <List /> : <ContentNotFound title="Пока нет друзей" />
      )}
    </FriendsListLayout>
  );
}, "FriendsAllList")