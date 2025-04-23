import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { LayoutGrid } from "lucide-react";
import { VIEW_COMPONENTS_TYPE } from "#components/friends/components/filtering/constants/view-components-type";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { ChangeEvent, forwardRef, useState } from "react";
import { Input } from "@repo/ui/src/components/input.tsx";
import { FilteringSearchWrapper } from "#components/wrappers/components/filtering-search-wrapper";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { useQueryClient } from "@tanstack/react-query";
import {
  PROFILE_THREADS_SORT_QUERY_KEY,
  ProfileThreadsSettingsQuery,
  ProfileThreadsViewType,
  profileThreadsSettingsQuery,
} from "#components/profile/threads/queries/profile-threads-settings-query.ts";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";

type ProfileThreadsFilteringProps = Pick<UserEntity, "nickname">;

const ProfileThreadsFilteringView = () => {
  const qc = useQueryClient();
  const { data: profileThreadsViewState } = profileThreadsSettingsQuery();

  const handleView = (type: ProfileThreadsViewType) => {
    return qc.setQueryData(
      PROFILE_THREADS_SORT_QUERY_KEY,
      (prev: ProfileThreadsSettingsQuery) => ({
        ...prev,
        viewType: type,
      }),
    );
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
          <LayoutGrid size={20} className="text-shark-300" />
        </SelectedWrapper>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <Typography textSize="small" className="text-shark-300 px-2 pt-2">
            Вид
          </Typography>
          <div className="flex flex-col gap-y-2">
            {VIEW_COMPONENTS_TYPE.map(({ value, title, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => handleView(value)}
                className="items-center gap-1"
              >
                <Icon size={16} className="text-shark-300" />
                <Typography
                  state={
                    value === profileThreadsViewState.viewType
                      ? "active"
                      : "default"
                  }
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

const ProfileThreadsFilteringSearch = forwardRef<HTMLInputElement>(
  (props, ref) => {
    const qc = useQueryClient();
    const [value, setValue] = useState<string>("");

    const updateQuery = (value: string) => {
      return qc.setQueryData(
        PROFILE_THREADS_SORT_QUERY_KEY,
        (prev: ProfileThreadsSettingsQuery) => ({
          ...prev,
          querySearch: value,
        }),
      );
    };

    const debouncedUpdateQuery = useDebounce(updateQuery, 300);

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(value);
      debouncedUpdateQuery(value);
    };

    return (
      <Input
        ref={ref}
        className="rounded-lg"
        value={value}
        maxLength={96}
        placeholder="Поиск по названию"
        onChange={handleSearchInput}
        {...props}
      />
    );
  },
);

export const ProfileThreadsFiltering = ({
  nickname,
}: ProfileThreadsFilteringProps) => {
  return (
    <div className="flex w-full justify-between h-14 items-center">
      <div className="flex items-center gap-1 w-fit">
        <Typography
          textColor="shark_white"
          textSize="big"
          className="font-semibold"
        >
          Треды {nickname}
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-fit">
        <FilteringSearchWrapper>
          <ProfileThreadsFilteringSearch />
        </FilteringSearchWrapper>
        <div className="w-fit">
          <ProfileThreadsFilteringView />
        </div>
      </div>
    </div>
  );
};
