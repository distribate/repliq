import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import React, { ChangeEvent, useState } from "react";
import {
  friendsSortAtom,
  FriendsSortType,
} from "#components/profile/friends/models/friends-sort.model";
import { FilteringSearchWrapper } from "#components/wrappers/components/filtering-search-wrapper";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { updateFriendsAction } from "#components/friends/models/update-friends.model";
import { ArrowDownNarrowWide } from "lucide-react";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/requested-user.model";

const ProfileFriendsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  const [value, setValue] = useState<string>("");

  const debouncedUpdateQuery = useDebounce((value: string) =>
    friendsSortAtom(ctx, (state) => ({ ...state, searchQuery: value })
  ), 300);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const convertedValue = e.target.value.replace(/ {3,}/g, "  ");
    setValue(convertedValue);
    debouncedUpdateQuery(convertedValue);
  };

  return (
    <Input
      className="rounded-lg"
      value={value}
      maxLength={64}
      placeholder="Поиск по никнейму"
      onChange={handleSearchInput}
      {...props}
    />
  );
}, "ProfileFriendsFilteringSearch")

type FriendsSort = {
  name: string;
  value: FriendsSortType;
};

const FRIENDS_SORT: FriendsSort[] = [
  { name: "По дате добавления", value: "created_at" },
  { name: "По привилегии", value: "donate_weight" },
];

const ProfileFriendsFilteringView = reatomComponent(({ ctx }) => {
  const currentSortType = "default" 

  const handleSort = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, sort_type: FriendsSortType) => {
    e.preventDefault();
    // friendsFilteringAtom(ctx, (state) => ({ ...state, sort_type }))
    // updateFriendsAction(ctx, "update-filter");
  };

  return (
    <DropdownWrapper
      properties={{
        sideAlign: "bottom",
        contentAlign: "end",
        contentClassname: "w-[200px]",
      }}
      trigger={
        <SelectedWrapper>
          <ArrowDownNarrowWide size={20} className="text-shark-300" />
        </SelectedWrapper>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <Typography className="text-shark-300 text-sm px-2 pt-2">
            Фильтровать по
          </Typography>
          <div className="flex flex-col gap-y-2">
            {FRIENDS_SORT.map(({ name, value }) => (
              <DropdownMenuItem
                key={value}
                onClick={(e) => handleSort(e, value)}
              >
                <Typography
                  state={value === currentSortType ? "active" : "default"}
                >
                  {name}
                </Typography>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      }
    />
  );
}, "ProfileFriendsFilteringView")

export const ProfileFriendsFiltering = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return;

  return (
    <div className="flex w-full justify-between h-14 items-center">
      <div className="flex items-center gap-1 w-fit">
        <Typography
          textColor="shark_white"
          textSize="big"
          className="font-semibold"
        >
          Друзья {nickname}
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-fit">
        <FilteringSearchWrapper>
          <ProfileFriendsFilteringSearch />
        </FilteringSearchWrapper>
        <div className="w-fit">
          <ProfileFriendsFilteringView />
        </div>
      </div>
    </div>
  );
}, "ProfileFriendsFiltering")