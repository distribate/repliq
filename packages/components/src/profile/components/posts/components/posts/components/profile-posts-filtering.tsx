import { ChangeEvent, forwardRef, useState } from "react";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { useQueryClient } from "@tanstack/react-query";
import {
  POSTS_FILTERING_QUERY_KEY,
  postsFilteringQuery,
  PostsFilteringQuery,
} from "#profile/components/posts/components/posts/queries/posts-filtering-query.ts";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { FilteringSearchWrapper } from "#wrappers/filtering-search-wrapper.tsx";
import {
  POSTS_SORT,
  PostSort,
} from "#profile/components/posts/components/posts/constants/posts-filtering.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";

type ProfilePostsFilteringProps = Pick<UserEntity, "nickname">;

const ProfilePostsFilteringSearch = forwardRef<HTMLInputElement>(
  (props, ref) => {
    const qc = useQueryClient();
    const [value, setValue] = useState<string>("");

    const updateQuery = (value: string) => {
      return qc.setQueryData(
        POSTS_FILTERING_QUERY_KEY,
        (prev: PostsFilteringQuery) => ({
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
        placeholder="Поиск по содержанию"
        onChange={handleSearchInput}
        {...props}
      />
    );
  },
);

const ProfilePostsFilteringView = () => {
  const { data: filteringState } = postsFilteringQuery();
  const qc = useQueryClient();

  const handleSortType = (type: Pick<PostSort, "value">["value"]) => {
    return qc.setQueryData(
      POSTS_FILTERING_QUERY_KEY,
      (prev: PostsFilteringQuery) => ({
        ...prev,
        filteringType: type,
      }),
    );
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
        <div className="flex items-center gap-1">
          <Typography textColor="gray" textSize="medium">
            {POSTS_SORT.find((item) => item.value === currentFilteringType)
              ?.title || POSTS_SORT[0].title}
          </Typography>
        </div>
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
};

export const ProfilePostsFiltering = ({
  nickname,
}: ProfilePostsFilteringProps) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-1 w-fit">
        <Typography
          textColor="shark_white"
          className="text-[22px] font-semibold"
        >
          Посты {nickname}
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-fit">
        <FilteringSearchWrapper>
          <ProfilePostsFilteringSearch />
        </FilteringSearchWrapper>
        <div className="w-fit">
          <ProfilePostsFilteringView />
        </div>
      </div>
    </div>
  );
};
