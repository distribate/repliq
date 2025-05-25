import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  FriendsListType,
  friendsViewAtom,
} from "#components/friends/components/filtering/models/friends-filtering.model";
import { PropsWithChildren } from "react";
import { reatomComponent } from "@reatom/npm-react";

type FriendsTabProps = PropsWithChildren & {
  type: FriendsListType
  title: string;
};

export const FriendsTab = reatomComponent<FriendsTabProps>(({ ctx, children, type, title }) => {
  const friendsFilteringState = ctx.spy(friendsViewAtom)
  const isActive = type === friendsFilteringState.listType;

  return (
    <div
      onClick={() => friendsViewAtom(ctx, (state) => ({ ...state, listType: type }))}
      className={`${isActive && "bg-shark-200 text-shark-950"}
        inline-flex justify-start items-center cursor-pointer transition-all rounded-lg p-4 whitespace-nowrap border border-white/10 w-full gap-2 group`}
    >
      <Typography textSize="medium" className="font-medium">
        {title}
      </Typography>
      {children && children}
    </div>
  );
}, "FriendsTab")