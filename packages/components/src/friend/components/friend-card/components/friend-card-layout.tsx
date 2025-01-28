import { FriendsQuery } from "#friends/queries/friends-query.ts";
import { ReactNode, Suspense } from "react";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";

type FriendCardLayoutProps = Pick<FriendsQuery, "nickname"> & {
  children: ReactNode;
};

export const FriendCardLayout = ({
  nickname,
  children,
}: FriendCardLayoutProps) => {
  return (
    <div className="flex items-center gap-4 friend-card">
      <Suspense fallback={<Skeleton className="w-[112px] h-[112px]" />}>
        <Avatar
          nickname={nickname}
          propHeight={112}
          propWidth={112}
          className="rounded-lg"
        />
      </Suspense>
      {children}
    </div>
  );
};