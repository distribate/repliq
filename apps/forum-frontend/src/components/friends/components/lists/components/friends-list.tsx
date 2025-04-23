import { friendsFilteringQuery } from "#components/friends/components/filtering/queries/friends-filtering-query.ts";
import { FriendsAllList } from "#components/friends/components/lists/components/friends-all-list";
import { FriendsFilteringView } from "../../filtering/components/friends-filtering-view";
import { FilteringSearchWrapper } from "#components/wrappers/components/filtering-search-wrapper";
import { FriendsFilteringSearch } from "../../filtering/components/friends-filtering-search";
import { Typography } from "@repo/ui/src/components/typography";
import { FriendsOutgoingList } from "./friends-outgoing-list";
import { FriendsIncomingList } from "./friends-incoming-list";
import { FriendsSearchingList } from "./friends-searching-list";
import { Suspense } from "react";

export const FriendsList = () => {
  const { data: friendsFilteringState } = friendsFilteringQuery();

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" textSize="very_big" className="font-semibold" >
            {friendsFilteringState.listType !== 'search' ? 'Ваши друзья' : "Поиск друзей"}
          </Typography>
        </div>
        <div className="flex items-center gap-4 w-fit">
          <FilteringSearchWrapper>
            <FriendsFilteringSearch />
          </FilteringSearchWrapper>
          <FriendsFilteringView />
        </div>
      </div>
      <Suspense>
        {friendsFilteringState.listType === "all" && <FriendsAllList />}
        {friendsFilteringState.listType === "outgoing" && <FriendsOutgoingList />}
        {friendsFilteringState.listType === "incoming" && <FriendsIncomingList />}
        {friendsFilteringState.listType === "search" && (
          <>
            <FriendsSearchingList />
          </>
        )}
      </Suspense>
    </div>
  );
};