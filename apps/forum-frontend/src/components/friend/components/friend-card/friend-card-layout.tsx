import { HTMLAttributes } from "react";

export const FriendCardLayout = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex items-start data-[view=list]:flex-row data-[view=grid]:flex-col group 
        overflow-hidden md:items-center gap-2 md:gap-4 relative w-full bg-shark-950 
        border-b border-shark-800 rounded-lg p-2 md:p-4"
      {...props}
    >
      {children}
    </div>
  );
};