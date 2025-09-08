import { FriendsSearchingCard } from "#components/friends/components/searching/components/friends-searching-card";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";
import { recommendedFriendsAction } from "#components/friends/models/recommended-friends.model";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";

const FriendsRecommendedIndividual = reatomComponent(({ ctx }) => {
  const data = ctx.spy(recommendedFriendsAction.dataAtom)

  if (ctx.spy(recommendedFriendsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-2 h-fit">
      {data.map(friend => (
        <FriendsSearchingCard
          key={friend.nickname}
          nickname={friend.nickname}
          name_color={friend.name_color}
          avatar={friend.avatar}
          details={friend.details}
        />
      ))}
    </div>
  );
}, "FriendsRecommendedIndividual")

export const FriendsRecommendedList = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Typography textSize="large" textColor="shark_white">
        Возможно вы знаете этих людей
      </Typography>
      <FriendsRecommendedIndividual />
    </div>
  );
}