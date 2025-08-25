import { Typography, TypographyProps } from "@repo/ui/src/components/typography.tsx";
import { cva } from "class-variance-authority";

type UserNickname = {
  nickname: string;
  nicknameColor?: string;
};

type UserNicknameProps = TypographyProps & UserNickname

const nicknameVariant = cva(`font-semibold tracking-tight`)

export const UserNickname = ({
  nickname, nicknameColor = "#ffffff", className, ...props
}: UserNicknameProps) => {
  return (
    <Typography className={nicknameVariant({ className })} style={{ color: nicknameColor }} {...props}>
      {nickname}
    </Typography>
  );
};