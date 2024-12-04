import { FriendsQuery } from "#friends/queries/friends-query.ts";
import { ReactNode } from "react";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";

type FriendCardLayoutProps = Pick<FriendsQuery, "nickname"> & {
  children: ReactNode;
};

export const FriendCardLayout = ({
  nickname,
  children,
}: FriendCardLayoutProps) => {
  return (
    <div className="flex items-center gap-4 friend-card">
      <Avatar
        nickname={nickname}
        propHeight={112}
        propWidth={112}
        className="rounded-lg"
      />
      {children}
    </div>
  );
};
