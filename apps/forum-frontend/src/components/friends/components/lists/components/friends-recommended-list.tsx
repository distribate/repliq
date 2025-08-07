import { FriendsSearchingCard } from "#components/friends/components/searching/components/friends-searching-card";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { recommendedFriendsAction } from "#components/friends/models/recommended-friends.model";
import { onConnect, onDisconnect } from "@reatom/framework";

onConnect(recommendedFriendsAction.dataAtom, recommendedFriendsAction)
onDisconnect(recommendedFriendsAction.dataAtom, (ctx) => recommendedFriendsAction.dataAtom.reset(ctx))

const FriendsRecommendedIndividual = reatomComponent(({ ctx }) => {
  const data = ctx.spy(recommendedFriendsAction.dataAtom)
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

export const FriendsRecommendedList = () => {
  return (
    <>
      <Typography textSize="large" textColor="shark_white">
        Возможно вы знаете этих игроков
      </Typography>
      <FriendsRecommendedIndividual />
    </>
  );
}