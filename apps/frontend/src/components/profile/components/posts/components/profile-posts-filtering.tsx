import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { selectedVariant } from "#ui/selected-wrapper";
import { ArrowDownNarrowWide } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { action } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";
import { postsSearchQueryAtom, postsTypeAtom, updatePostsAction } from "../models/posts.model";

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  await ctx.schedule(() => sleep(300))

  const filtered = value.replace(/ {3,}/g, "  ")
  postsSearchQueryAtom(ctx, filtered)

  await ctx.schedule(() => sleep(40));

  updatePostsAction(ctx, "update-filter")
}).pipe(withConcurrency())

const POSTS_SORT = [
  { title: "По дате публикации", value: "created_at" },
  { title: "По кол-ву просмотров", value: "views_count" },
] as const;

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

const updateViewAction = action((ctx, type: typeof POSTS_SORT[number]["value"]) => {
  postsTypeAtom(ctx, type)
  updatePostsAction(ctx, "update-filter");
}, "updateViewAction")

const ProfilePostsFilteringView = reatomComponent(({ ctx }) => {
  const currentFilteringType = ctx.spy(postsTypeAtom)

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
                onClick={() => updateViewAction(ctx, value)}
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
  return (
    <div className="flex items-center gap-2 w-fit">
      <ProfilePostsFilteringSearch />
      <div className="w-fit">
        <ProfilePostsFilteringView />
      </div>
    </div>
  );
}, "ProfilePostsFiltering")