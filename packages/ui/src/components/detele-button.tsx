import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";
import { Button } from "./button.tsx";

export const actionButtonVariant = cva(`
  flex items-center justify-center rounded-sm aspect-square cursor-pointer duration-150
`)

const deleteButtonVariants = cva(
  `${actionButtonVariant()} z-[3] hover:bg-red-800 bg-red-700 overflow-hidden`,
  {
    variants: {
      variant: {
        invisible:
          "md:opacity-0 md:group-hover:opacity-100 absolute top-1 right-1 group-hover:duration-150",
      },
      size: {
        default: "h-1 w-1 p-2",
        small: "h-8 w-8",
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
      <X size={16} className="text-shark-50" />
    </Button>
  );
};