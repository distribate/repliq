import { Button, ButtonProps } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

interface ConfirmationButtonProps extends ButtonProps {
  title: string;
  actionType: "cancel" | "continue";
}

export const ConfirmationButton = ({
  title,
  actionType,
  ...props
}: ConfirmationButtonProps) => {
  return (
    <Button className="hover:bg-shark-50/80 focus:bg-shark-50/80 group  backdrop-blur-lg duration-300 ease-in-out transition" {...props}>
      <Typography
        className={`duration-300 ease-in-out transition text-base 
          ${actionType === "continue" ? "text-white group-hover:text-shark-950 group-focus:text-shark-950" : "text-red-600"} font-semibold`}
      >
        {title}
      </Typography>
    </Button>
  );
};
