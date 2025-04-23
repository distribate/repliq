import { ContentNotFound } from "#components/templates/components/content-not-found";
import { searchingFriends } from "#components/friends/queries/searching-friends-query.ts";
import { FriendsSearchingCard } from "#components/friends/components/searching/components/friends-searching-card";
import { FriendsAllListSkeleton } from "#components/skeletons/components/friends-all-list-skeleton";
import { Typography } from "@repo/ui/src/components/typography";

export const FriendsSearchingList = () => {
  const { data, isLoading } = searchingFriends();

  if (isLoading) return <FriendsAllListSkeleton />;

  const searchingUsersByLands = data?.byLands ?? [];
  const searchingUsersByFriends = data?.byFriends ?? [];

  if (!searchingUsersByFriends.length && !searchingUsersByLands.length) {
    return <ContentNotFound title="Пока никого не можем вам предложить :/" />;
  }

  return (
    <>
      <Typography textSize="large" textColor="shark_white">
        Возможно вы знаете этих игроков
      </Typography>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-2 h-fit">
        {searchingUsersByLands.map((user) => (
          <>
            <FriendsSearchingCard
              key={user.members.nickname}
              nickname={user.members.nickname}
              type="byLands"
              land={user.land.name}
            />
          </>
        ))}
        {searchingUsersByFriends.map((user) => (
          <>
            <FriendsSearchingCard
              key={user.nickname}
              nickname={user.nickname}
              type="byFriends"
              friend={user.friend}
            />
          </>
        ))}
      </div>
    </>
  );
};