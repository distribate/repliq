import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ReactNode } from "react";

type ConfirmationActionModalTemplateProps = {
  children: ReactNode;
  title: string;
};

export const ConfirmationActionModalTemplate = ({
  children,
  title,
}: ConfirmationActionModalTemplateProps) => {
  return (
    <div className="flex flex-col gap-y-6 justify-between items-center px-3 pb-4">
      <Typography className="text-xl text-shark-50">{title}</Typography>
      <div className="flex justify-end w-full gap-4">{children}</div>
    </div>
  );
};
