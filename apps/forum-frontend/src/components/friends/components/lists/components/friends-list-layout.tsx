import { reatomComponent } from "@reatom/npm-react";
import { HTMLAttributes } from "react";
import { friendsViewAtom } from "../../filtering/models/friends-filtering.model";

export const FriendsListLayout = reatomComponent<HTMLAttributes<HTMLDivElement>>(({ ctx, ...props }) => {
  const viewType = ctx.spy(friendsViewAtom).viewType

  return (
    <div
      data-view={viewType}
      className="flex gap-2 h-full 
        data-[view=list]:flex-col 
        data-[view=grid]:grid data-[view=grid]:grid-cols-1 data-[view=grid]:md:grid-cols-2 data-[view=grid]:auto-rows-auto"
      {...props}
    />
  );
}, "FriendsListLayout")