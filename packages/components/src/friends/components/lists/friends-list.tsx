"use client";

import { friendsFilteringQuery } from "#friends/components/filtering/queries/friends-filtering-query.ts";
import { FriendsAllList } from "#friends/components/lists/friends-all-list.tsx";
import { FriendsFilteringView } from "../filtering/components/friends-filtering-view";
import { FilteringSearchWrapper } from "#wrappers/filtering-search-wrapper.tsx";
import { FriendsFilteringSearch } from "../filtering/components/friends-filtering-search";
import { Typography } from "@repo/ui/src/components/typography";
import { FriendsOutgoingList } from "./friends-outgoing-list";
import { FriendsIncomingList } from "./friends-incoming-list";
import { FriendsSearchingList } from "./friends-searching-list";

export const FriendsList = () => {
  const { data: friendsFilteringState } = friendsFilteringQuery();

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" className="text-[22px] font-semibold" >
            Ваши друзья
          </Typography>
        </div>
        <div className="flex items-center gap-4 w-fit">
          <FilteringSearchWrapper>
            <FriendsFilteringSearch />
          </FilteringSearchWrapper>
          <FriendsFilteringView />
        </div>
      </div>
      {friendsFilteringState.listType === "all" && <FriendsAllList />}
      {friendsFilteringState.listType === "outgoing" && <FriendsOutgoingList />}
      {friendsFilteringState.listType === "incoming" && <FriendsIncomingList />}
      {friendsFilteringState.listType === "search" && <FriendsSearchingList />}
    </div>
  );
};