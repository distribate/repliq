import { LayoutGrid } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper.tsx";
import {
  friendsViewAtom,
} from "../models/friends-filtering.model.ts";
import { VIEW_COMPONENTS_TYPE } from "#components/friends/components/filtering/constants/view-components-type.ts";
import { reatomComponent } from "@reatom/npm-react";

export const FriendsFilteringView = reatomComponent(({ ctx }) => {
  const friendsFiltering = ctx.spy(friendsViewAtom)

  return (
    <div className="w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <SelectedWrapper>
            <LayoutGrid size={20} className="text-shark-300" />
          </SelectedWrapper>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="min-w-[200px]">
          <div className="flex flex-col gap-y-2">
            <Typography textSize="small" className="text-shark-300 px-2 pt-2">
              Вид
            </Typography>
            <div className="flex flex-col gap-y-2">
              {VIEW_COMPONENTS_TYPE.map(({ title, value, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => friendsViewAtom(ctx, (state) => ({ ...state, viewType: value }))}
                  className="items-center gap-1"
                >
                  <Icon size={16} className="text-shark-300" />
                  <Typography state={friendsFiltering.viewType === value ? "active" : "default"}>
                    {title}
                  </Typography>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}, "FriendsFilteringView")