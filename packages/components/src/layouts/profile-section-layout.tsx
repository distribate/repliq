import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ReactNode } from "react";

type ProfileSectionLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export const ProfileSectionLayout = ({
  header,
  children,
}: ProfileSectionLayoutProps) => {
  return (
    <div className="flex flex-col w-full gap-y-4">
      {header && header}
      <Separator orientation="horizontal" />
      {children}
    </div>
  );
};
