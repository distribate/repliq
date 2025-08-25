import { reatomComponent } from "@reatom/npm-react";
import { HTMLAttributes } from "react";

export const FriendsListLayout = reatomComponent<HTMLAttributes<HTMLDivElement>>(({ ctx, ...props }) => {
  return (
    <div
      className="flex gap-4 h-full w-full flex-col "
      {...props}
    />
  );
}, "FriendsListLayout")