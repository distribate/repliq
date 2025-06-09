import { Typography } from "@repo/ui/src/components/typography";
import { HTMLAttributes } from "react";

type ProfileSetting = {
  title: string;
  imageSrc?: string;
} & HTMLAttributes<HTMLDivElement>

export const UserSettingOption = ({
  title, children, imageSrc, ...props
}: ProfileSetting) => {
  return (
    <div
      className="flex hover:bg-shark-600 focus:bg-shark-600 cursor-default select-none items-center rounded-sm px-2 relative py-2 justify-between w-full"
      {...props}
    >
      <div className="flex gap-x-2 items-center w-full">
        {imageSrc && (
          <img src={imageSrc} alt={title} width={26} className="max-w-[26px] max-h-[26px]" height={26} />
        )}
        <Typography className="text-base">{title}</Typography>
      </div>
      <div className="min-w-fit">{children || " "}</div>
    </div>
  );
};