import { ContentNotFound } from "#components/templates/components/content-not-found";
import { searchingFriendsAction, searchingFriendsAtom } from "#components/friends/queries/searching-friends-query.ts";
import { FriendsSearchingCard } from "#components/friends/components/searching/components/friends-searching-card";
import { FriendsAllListSkeleton } from "#components/skeletons/components/friends-all-list-skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";

const FriendsSearchingContent = reatomComponent(({ ctx }) => {
  const data = ctx.spy(searchingFriendsAtom)

  if (ctx.spy(searchingFriendsAction.statusesAtom).isPending) {
    return <FriendsAllListSkeleton />;
  }

  const resultsByLands = data?.byLands ?? [];
  const resultsByFriends = data?.byFriends ?? [];

  if (!resultsByFriends.length && !resultsByLands.length) {
    return <ContentNotFound title="Пока никого не можем вам предложить" />;
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-2 h-fit">
      {resultsByLands.map((user) => (
        <FriendsSearchingCard
          key={user.members.nickname}
          nickname={user.members.nickname}
          type="byLands"
          land={user.land.name}
        />
      ))}
      {resultsByFriends.map((user) => (
        <FriendsSearchingCard
          key={user.nickname}
          nickname={user.nickname}
          type="byFriends"
          friend={user.friend}
        />
      ))}
    </div>
  )
})

export const FriendsSearchingList = () => {
  return (
    <>
      <Typography textSize="large" textColor="shark_white">
        Возможно вы знаете этих игроков
      </Typography>
      <FriendsSearchingContent />
    </>
  );
}