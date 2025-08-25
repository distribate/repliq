import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import {
  postsFilteringAtom,
  PostsFilteringQuery,
} from "#components/profile/posts/models/filter-posts.model";
import { selectedVariant } from "#ui/selected-wrapper";
import { ArrowDownNarrowWide } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { updatePostsAction } from "../models/update-posts.model";
import { action } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";

const onChange = action(async (ctx, e) => {
  const { value } = e.taregt;

  await ctx.schedule(() => sleep(800))

  const filtered = value.replace(/ {3,}/g, "  ")

  postsFilteringAtom(ctx, (state: PostsFilteringQuery) => ({ ...state, searchQuery: filtered }))
}).pipe(withConcurrency())

const ProfilePostsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  return (
    <Input
      className="rounded-lg"
      maxLength={64}
      placeholder="Поиск по содержанию"
      onChange={e => onChange(ctx, e)}
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={selectedVariant()}>
          <ArrowDownNarrowWide size={20} className="text-shark-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-[200px]">
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
      </DropdownMenuContent>
    </DropdownMenu>
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