import { cn } from "@repo/lib/utils/ui/cn.ts";
import { Ref, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
}

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        `flex min-h-[48px] w-full rounded-md border-none bg-transparent
           px-4 py-1 text-sm ring-offset-background placeholder:text-shark-300
            focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed
             disabled:opacity-50`,
        className,
      )}
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";

export { Textarea };