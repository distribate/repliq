import { ReactNode } from "react";

type FriendCardLayoutProps = {
  children: ReactNode;
};

export const FriendCardLayout = ({
  children,
}: FriendCardLayoutProps) => {
  return (
    <div className="flex items-center gap-4 friend-card">
      {children}
    </div>
  );
};