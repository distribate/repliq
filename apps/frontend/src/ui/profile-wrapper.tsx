import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ReactNode } from "react";

type ProfileWrapperProps = {
  header?: ReactNode;
  children: ReactNode;
};

export const ProfileWrapper = ({ header, children }: ProfileWrapperProps) => {
  return (
    <div className="flex flex-col relative h-full w-full gap-4">
      {header}
      <Separator orientation="horizontal" />
      {children}
    </div>
  );
};