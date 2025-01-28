import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import React, { ChangeEvent, forwardRef, useState } from "react";
import { FRIENDS_SORT } from "#profile/components/friends/constants/friends-filtering.ts";
import { useQueryClient } from "@tanstack/react-query";
import {
  FRIENDS_SORT_QUERY_KEY,
  friendsSortQuery,
  FriendsSortQuery,
  FriendsSortType,
} from "#profile/components/friends/queries/friends-settings-query.ts";
import { FilteringSearchWrapper } from "#wrappers/filtering-search-wrapper.tsx";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { useLocation } from "@tanstack/react-router";

const ProfileFriendsFilteringSearch = forwardRef<HTMLInputElement>(
  (props, ref) => {
    const qc = useQueryClient();
    const [value, setValue] = useState<string>("");

    const updateQuery = (value: string) => {
      return qc.setQueryData(
        FRIENDS_SORT_QUERY_KEY,
        (prev: FriendsSortQuery) => ({
          ...prev,
          searchQuery: value,
        }),
      );
    };

    const debouncedUpdateQuery = useDebounce(updateQuery, 300);

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const convertedValue = value.replace(/ {3,}/g, "  ");
      setValue(convertedValue);
      debouncedUpdateQuery(convertedValue);
    };

    return (
      <Input
        ref={ref}
        className="rounded-lg"
        value={value}
        maxLength={64}
        placeholder="Поиск по никнейму"
        onChange={handleSearchInput}
        {...props}
      />
    );
  },
);

const ProfileFriendsFilteringView = () => {
  const qc = useQueryClient();
  const location = useLocation();
  const { sort_type: currentSortType } = friendsSortQuery().data;

  const handleSort = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, sort_type: FriendsSortType) => {
    e.preventDefault();

    const nickname = location.pathname.split("/")[2];

    if (!nickname) return;

    qc.setQueryData(
      FRIENDS_SORT_QUERY_KEY,
      (prev: FriendsSortQuery) => ({ ...prev, sort_type }),
    );

    qc.refetchQueries({
      queryKey: FRIENDS_QUERY_KEY(nickname),
    });
  };

  return (
    <DropdownWrapper
      properties={{
        sideAlign: "bottom",
        contentAlign: "end",
        contentClassname: "w-[200px]",
      }}
      trigger={
        <div className="flex items-center gap-1">
          <Typography
            className="text-shark-300"
            textSize="medium"
          >
            По дате добавления
          </Typography>
        </div>
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
};

export const ProfileFriendsFiltering = () => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-1 w-fit">
        <Typography
          textColor="shark_white"
          textSize="big"
          className="font-semibold"
        >
          Друзья
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
};