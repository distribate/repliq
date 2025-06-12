import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import React, { ChangeEvent } from "react";
import {
  friendsSortAtom,
  FriendsSortType,
} from "#components/profile/friends/models/friends-sort.model";
import { FilteringSearchWrapper } from "#components/wrappers/components/filtering-search-wrapper";
import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { updateFriendsAction } from "#components/friends/models/update-friends.model";
import { ArrowDownNarrowWide } from "lucide-react";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { action, sleep, withConcurrency } from "@reatom/framework";

const onChange = action(async (ctx, e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;

  await ctx.schedule(() => sleep(300))
  const convertedValue = value.replace(/ {3,}/g, "  ");
  friendsSortAtom(ctx, (state) => ({ ...state, searchQuery: convertedValue }))
}).pipe(withConcurrency())

const ProfileFriendsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  return (
    <Input
      className="rounded-lg"
      maxLength={64}
      placeholder="Поиск по никнейму"
      onChange={e => onChange(ctx, e)}
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
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center w-fit">
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