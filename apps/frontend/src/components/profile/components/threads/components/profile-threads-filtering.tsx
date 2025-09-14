import { Typography } from "@repo/ui/src/components/typography.tsx";
import { selectedVariant } from "#ui/selected-wrapper";
import { LayoutGrid } from "lucide-react";
import { VIEW_COMPONENTS_TYPE } from "#components/friends/components/filtering/constants/view-components-type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { action, sleep, withConcurrency } from "@reatom/framework";
import { profileThreadsSearchQueryAtom, profileThreadsViewAtom } from "../models/profile-threads.model";
import { updateProfileThreadsAction } from "../models/profile-threads.model";

const ProfileThreadsFilteringView = reatomComponent(({ ctx }) => {
  const view = ctx.spy(profileThreadsViewAtom)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={selectedVariant()}>
          <LayoutGrid size={20} className="text-shark-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-[200px]">
        <div className="flex flex-col gap-y-2">
          <Typography textSize="small" className="text-shark-300 px-2 pt-2">
            Вид
          </Typography>
          <div className="flex flex-col gap-y-2">
            {VIEW_COMPONENTS_TYPE.map(({ value, title, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => profileThreadsViewAtom(ctx, value)}
                className="items-center gap-1"
              >
                <Icon size={16} className="text-shark-300" />
                <Typography
                  state={
                    value === view
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}, "ProfileThreadsFilteringView")

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  await ctx.schedule(() => sleep(300))

  profileThreadsSearchQueryAtom(ctx, value)

  await ctx.schedule(() => sleep(40))

  updateProfileThreadsAction(ctx, "update-filter")
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

export const ProfileThreadsFiltering = () => {
  return (
    <div className="flex items-center gap-2 w-fit">
      <ProfileThreadsFilteringSearch />
      <div className="w-fit">
        <ProfileThreadsFilteringView />
      </div>
    </div>
  );
}