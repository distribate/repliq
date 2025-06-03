import { HTMLAttributes } from "react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { cn } from "@repo/lib/utils/ui/cn";

type UserNickname = {
  nickname: string;
  nicknameColor?: string;
};

type UserNicknameProps = HTMLAttributes<HTMLParagraphElement> & UserNickname

export const UserNickname = ({
  nickname, nicknameColor = "#ffffff", className, ...props
}: UserNicknameProps) => {
  return (
    <Typography className={cn("font-semibold tracking-tight", className)} style={{ color: nicknameColor }} {...props}>
      {nickname}
    </Typography>
  );
};