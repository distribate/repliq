import { LayoutGrid } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { DropdownWrapper } from "#components/wrappers/dropdown-wrapper.tsx";
import { SelectedWrapper } from "#components/wrappers/selected-wrapper.tsx";
import {
  FRIENDS_FILTERING_QUERY_KEY,
  FriendsFilteringQuery,
  friendsFilteringQuery,
  FriendsFilteringViewType,
} from "../queries/friends-filtering-query.ts";
import { isValue } from "@repo/lib/helpers/check-is-value.ts";
import { VIEW_COMPONENTS_TYPE } from "#components/friends/components/filtering/contants/view-components-type.ts";
import { useQueryClient } from "@tanstack/react-query";

export const FriendsFilteringView = () => {
  const qc = useQueryClient();
  const { data: friendsFiltering } = friendsFilteringQuery();

  const handleView = (viewType: FriendsFilteringViewType) => {
    return qc.setQueryData(
      FRIENDS_FILTERING_QUERY_KEY,
      (prev: FriendsFilteringQuery) => ({
        ...prev,
        viewType,
      }),
    );
  };

  const isViewType = isValue(friendsFiltering.viewType);

  return (
    <div className="w-fit">
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
              {VIEW_COMPONENTS_TYPE.map(({ title, value, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleView(value)}
                  className="items-center gap-1"
                >
                  <Icon size={16} className="text-shark-300" />
                  <Typography state={isViewType(value) ? "active" : "default"}>
                    {title}
                  </Typography>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
};
