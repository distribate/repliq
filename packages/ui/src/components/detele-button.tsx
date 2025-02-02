import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";
import { Button } from "./button.tsx";

const deleteButtonVariants = cva(
  "rounded-md items-center duration-150 z-[3] bg-red-600 hover:duration-150 justify-center cursor-pointer overflow-hidden flex",
  {
    variants: {
      variant: {
        invisible:
          "opacity-0 group-hover:opacity-100 absolute top-2 right-1 group-hover:duration-150",
      },
      size: {
        default: "h-7 w-7",
        small: "h-5 w-5",
        medium: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type DeleteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof deleteButtonVariants>

export const DeleteButton = ({
  size, variant, className, ...props
}: DeleteButtonProps) => {
  return (
    <Button className={deleteButtonVariants({ variant, className, size })} {...props}>
      <X size={18} className="text-shark-50" />
    </Button>
  );
};