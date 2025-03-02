import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { DropdownWrapper } from "#components/wrappers/dropdown-wrapper.tsx";
import React, { ChangeEvent, forwardRef, useState } from "react";
import { FRIENDS_SORT } from "#components/profile/friends/constants/friends-filtering.ts";
import { useQueryClient } from "@tanstack/react-query";
import {
  FRIENDS_SORT_QUERY_KEY,
  friendsSortQuery,
  FriendsSortQuery,
  FriendsSortType,
} from "#components/profile/friends/queries/friends-settings-query.ts";
import { FilteringSearchWrapper } from "#components/wrappers/filtering-search-wrapper.tsx";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { useUpdateFriends } from "#components/friends/hooks/use-update-friends.ts";
import { ArrowDownNarrowWide } from "lucide-react";
import { SelectedWrapper } from "#components/wrappers/selected-wrapper.tsx";

const ProfileFriendsFilteringSearch = forwardRef<HTMLInputElement>(
  (props, ref) => {
    const qc = useQueryClient();
    const [value, setValue] = useState<string>("");

    const updateQuery = (value: string) => {
      return qc.setQueryData(
        FRIENDS_SORT_QUERY_KEY,
        (prev: FriendsSortQuery) => ({
          ...prev, searchQuery: value,
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

const ProfileFriendsFilteringView = ({ nickname }: { nickname: string }) => {
  const qc = useQueryClient();
  const { sort_type: currentSortType } = friendsSortQuery().data;
  const { updateFriendsMutation } = useUpdateFriends();

  const handleSort = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, sort_type: FriendsSortType) => {
    e.preventDefault();

    qc.setQueryData(FRIENDS_SORT_QUERY_KEY, (prev: FriendsSortQuery) => ({ ...prev, sort_type }));

    updateFriendsMutation.mutate({ nickname, type: "update-filter" });
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
};

export const ProfileFriendsFiltering = ({
  nickname
}: { nickname: string }) => {
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
          <ProfileFriendsFilteringView nickname={nickname} />
        </div>
      </div>
    </div>
  );
};