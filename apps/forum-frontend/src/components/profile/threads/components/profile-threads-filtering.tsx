import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { LayoutGrid } from "lucide-react";
import { VIEW_COMPONENTS_TYPE } from "#components/friends/components/filtering/constants/view-components-type";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { ChangeEvent } from "react";
import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { FilteringSearchWrapper } from "#components/wrappers/components/filtering-search-wrapper";
import {
  profileThreadsSettingsAtom,
} from "#components/profile/threads/models/profile-threads-settings.model";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { action, sleep, withConcurrency } from "@reatom/framework";

const ProfileThreadsFilteringView = reatomComponent(({ ctx }) => {
  const profileThreadsViewState = ctx.spy(profileThreadsSettingsAtom)

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
                onClick={() => profileThreadsSettingsAtom(ctx, (state) => ({ ...state, viewType: value }))}
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
}, "ProfileThreadsFilteringView")

const onChange = action(async (ctx, e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;

  await ctx.schedule(() => sleep(300))

  profileThreadsSettingsAtom(ctx, (state) => ({ ...state, querySearch: value }))
}).pipe(withConcurrency())

const ProfileThreadsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  return (
    <Input
      className="rounded-lg"
      maxLength={96}
      placeholder="Поиск по названию"
      onChange={e => onChange(ctx, e)}
      {...props}
    />
  );
}, "ProfileThreadsFilteringSearch")

export const ProfileThreadsFiltering = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(requestedUserParamAtom)!

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center w-fit">
        <Typography textColor="shark_white" textSize="big" className="font-semibold">
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
}, "ProfileThreadsFiltering")