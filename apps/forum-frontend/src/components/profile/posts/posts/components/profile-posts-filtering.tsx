import { ChangeEvent, useState } from "react";
import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import {
  postsFilteringAtom,
  PostsFilteringQuery,
} from "#components/profile/posts/posts/models/filter-posts.model";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { updatePostsAction } from "../models/update-posts.model";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { ArrowDownNarrowWide } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/requested-user.model";

const ProfilePostsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  const [value, setValue] = useState<string>("");

  const updateQuery = (value: string) => {
    postsFilteringAtom(ctx, (state: PostsFilteringQuery) => ({ ...state, searchQuery: value }))
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
      className="rounded-lg"
      value={value}
      maxLength={64}
      placeholder="Поиск по содержанию"
      onChange={handleSearchInput}
      {...props}
    />
  );
}, "ProfilePostsFilteringSearch");

type PostSort = {
  title: string;
  value: Pick<PostsFilteringQuery, "filteringType">["filteringType"];
};

const POSTS_SORT: PostSort[] = [
  { title: "По дате публикации", value: "created_at" },
  { title: "По кол-ву просмотров", value: "views_count" },
];

const ProfilePostsFilteringView = reatomComponent(({ ctx }) => {
  const filteringState = ctx.spy(postsFilteringAtom)
  const nickname = ctx.spy(requestedUserParamAtom)

  const handleSortType = (type: Pick<PostSort, "value">["value"]) => {
    if (!nickname) return;

    postsFilteringAtom(ctx, (state: PostsFilteringQuery) => ({
      ...state, filteringType: type, cursor: undefined,
    }))

    updatePostsAction(ctx, { nickname, type: "update-filter" });
  };

  const currentFilteringType = filteringState.filteringType;

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
        // <div className="flex items-center gap-1">
        //   <Typography textColor="gray" textSize="medium">
        //     {POSTS_SORT.find((item) => item.value === currentFilteringType)
        //       ?.title || POSTS_SORT[0].title}
        //   </Typography>
        // </div>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <Typography className="text-shark-300 text-sm px-2 pt-2">
            Фильтровать по
          </Typography>
          <div className="flex flex-col gap-y-2">
            {POSTS_SORT.map(({ value, title }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => handleSortType(value)}
                className="items-center gap-1"
              >
                <Typography
                  state={currentFilteringType === value ? "active" : "default"}
                >
                  {title}
                </Typography>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      }
    />
  );
}, "ProfilePostsFilteringView")

export const ProfilePostsFiltering = reatomComponent(({ ctx }) => {
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
          Посты {nickname}
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-fit">
        {/* <FilteringSearchWrapper>
          <ProfilePostsFilteringSearch />
        </FilteringSearchWrapper> */}
        <div className="w-fit">
          <ProfilePostsFilteringView />
        </div>
      </div>
    </div>
  );
}, "ProfilePostsFiltering")