import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

const createThreadCommentFormVariants = cva(
  "flex flex-col border focus-visible:border-caribbean-green-200/40 bg-shark-950 overflow-hidden w-full h-full",
  {
    variants: {
      variant: {
        single: "rounded-md border-[1px]",
        reply: "rounded-b-md border-b-[1px]",
      },
      state: {
        none: "border-caribbean-green-200/40",
        active: "border-shark-700",
      },
    },
    defaultVariants: {
      variant: "single",
    },
  },
);

interface CreateThreadCommentFormProps
  extends HTMLAttributes<HTMLFormElement>,
    VariantProps<typeof createThreadCommentFormVariants> {}

export const CreateThreadCommentFormLayout = forwardRef<
  HTMLFormElement,
  CreateThreadCommentFormProps
>(({ className, variant, state, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={createThreadCommentFormVariants({ className, state, variant })}
      {...props}
    />
  );
});
