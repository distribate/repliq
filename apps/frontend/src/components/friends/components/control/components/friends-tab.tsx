import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  friendsListTypeAtom,
} from "#components/friends/components/filtering/models/friends-filtering.model";
import { PropsWithChildren } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { AtomState } from "@reatom/core";

type FriendsTabProps = PropsWithChildren & {
  type: AtomState<typeof friendsListTypeAtom>
  title: string;
};

export const FriendsTab = reatomComponent<FriendsTabProps>(({ ctx, children, type, title }) => {
  const listType = ctx.spy(friendsListTypeAtom)
  const isActive = type === listType

  const handle = () => {
    friendsListTypeAtom(ctx, type)
  }

  return (
    <div
      onClick={handle}
      className={`${isActive && "bg-shark-200 text-shark-950"}
        inline-flex justify-start items-center cursor-pointer rounded-lg p-4 whitespace-nowrap border border-white/10 w-full gap-2 group`}
    >
      <Typography textSize="medium" className="font-medium">
        {title}
      </Typography>
      {children}
    </div>
  );
}, "FriendsTab")