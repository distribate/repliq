import { MoreVertical } from "lucide-react";
import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";

const moreWrapperVariants = cva(
  "flex backdrop-blur-lg rounded-md items-center justify-center",
  {
    variants: {
      variant: {
        default: "p-2",
        small: "p-1",
        medium: "h-10 w-10",
      },
      background: {
        default: "bg-secondary-color",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
      background: "default",
    },
  },
);

type MoreWrapperProps = {
  trigger?: React.ReactNode,
  content?: React.ReactNode,
} & HTMLAttributes<HTMLDivElement> & VariantProps<typeof moreWrapperVariants>

export const MoreWrapper = ({ className, variant, background, ...props }: MoreWrapperProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className={moreWrapperVariants({ background, variant, className })}>
          <MoreVertical size={20} className="text-shark-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div
          className="flex flex-col gap-y-2 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}