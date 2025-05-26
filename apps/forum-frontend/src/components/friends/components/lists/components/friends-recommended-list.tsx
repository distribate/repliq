import { ContentNotFound } from "#components/templates/components/content-not-found";
import { FriendsSearchingCard } from "#components/friends/components/searching/components/friends-searching-card";
import { FriendsAllListSkeleton } from "#components/skeletons/components/friends-all-list-skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { 
  recommendedFriendsAction, 
  RecommendedFriendsGlobal, 
  RecommendedFriendsIndividual, 
  recommendedFriendsTypeAtom 
} from "#components/friends/models/recommended-friends.model";

const FriendsRecommendedGlobal = reatomComponent(({ ctx }) => {
  const type = ctx.spy(recommendedFriendsTypeAtom)
  if (!type) return null;

  const data = type === 'global' ? ctx.spy(recommendedFriendsAction.dataAtom) as RecommendedFriendsGlobal : null
  if (!data) return null;

  if (ctx.spy(recommendedFriendsAction.statusesAtom).isPending) {
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
}, "FriendsRecommendedGlobal")

export const FriendsRecommendedIndividual = reatomComponent(({ ctx }) => {
  const type = ctx.spy(recommendedFriendsTypeAtom)
  if (!type) return null;

  const data = type === 'individual' ? ctx.spy(recommendedFriendsAction.dataAtom) as RecommendedFriendsIndividual : null;
  if (!data) return null;

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-2 h-fit">
      {data.map(friend => (
        <FriendsSearchingCard
          key={friend.nickname}
          nickname={friend.nickname}
          type="default"
        />
      ))}
    </div>
  );
}, "FriendsRecommendedIndividual")

const Sync = () => {
  useUpdate(recommendedFriendsAction, [])
  return null;
}

export const FriendsRecommendedList = reatomComponent(({ ctx }) => {
  const type = ctx.spy(recommendedFriendsTypeAtom)

  return (
    <>
      <Sync />
      <Typography textSize="large" textColor="shark_white">
        Возможно вы знаете этих игроков
      </Typography>
      {type === 'global' ? (
        <FriendsRecommendedGlobal />
      ) : (
        <FriendsRecommendedIndividual />
      )}
    </>
  );
}, "FriendsRecommendedList")