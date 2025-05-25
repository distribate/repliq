import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { Typography } from "@repo/ui/src/components/typography.tsx";

const nicknameVariants = cva("font-[Minecraft]", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type UserNickname = {
  nickname: string;
  nicknameColor?: string;
};

type UserNicknameProps = HTMLAttributes<HTMLParagraphElement> 
  & VariantProps<typeof nicknameVariants> & UserNickname

export const UserNickname = ({
  nickname, nicknameColor = "#ffffff", className, variant, ...props
}: UserNicknameProps) => {
  return (
    <Typography className={nicknameVariants({ variant, className })} style={{ color: nicknameColor }} {...props}>
      {nickname}
    </Typography>
  );
};