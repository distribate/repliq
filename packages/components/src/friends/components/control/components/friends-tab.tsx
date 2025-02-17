import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  FRIENDS_FILTERING_QUERY_KEY,
  friendsFilteringQuery,
  FriendsFilteringQuery,
} from "#friends/components/filtering/queries/friends-filtering-query.ts";
import { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

type FriendsTabProps = {
  children?: ReactNode;
  type: Pick<FriendsFilteringQuery, "listType">["listType"];
  title: string;
};

export const FriendsTab = ({ children, type, title }: FriendsTabProps) => {
  const qc = useQueryClient();
  const { data: friendsFilteringState } = friendsFilteringQuery();

  const handleFriendsListType = () => {
    return qc.setQueryData(
      FRIENDS_FILTERING_QUERY_KEY,
      (prev: FriendsFilteringQuery) => ({
        ...prev,
        listType: type,
      }),
    );
  };

  const isActive = type === friendsFilteringState.listType;

  return (
    <div
      onClick={handleFriendsListType}
      className={`${isActive && "bg-shark-200 text-shark-950"}
        inline-flex justify-start items-center cursor-pointer transition-all rounded-lg p-4 whitespace-nowrap border border-white/10 w-full gap-2 group`}
    >
      <Typography textSize="medium" className="font-medium">
        {title}
      </Typography>
      {children && children}
    </div>
  );
};
