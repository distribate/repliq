import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@repo/ui/src/components/select.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { postFormFieldAtom, VisibilityPost } from "../models/post-form.model.ts";
import { Eye } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { visibilityProperties } from "../models/create-post.model.ts";

export const PostAdditionalForm = reatomComponent(({ ctx }) => {
  const { visibility: currentVisibility } = ctx.spy(postFormFieldAtom)

  const currentVisibilityOption = visibilityProperties.find(
    (option) => option.value === currentVisibility,
  );

  return (
    <Select
      defaultValue={currentVisibility}
      onValueChange={(value: VisibilityPost) => postFormFieldAtom(ctx, (state) => ({ ...state, visibility: value }))}
    >
      <SelectTrigger className="px-2 w-fit border border-shark-700/40 gap-2 items-center">
        <Eye size={18} className="text-shark-300" />
        <Typography className="text-[16px]" textColor="gray">
          {currentVisibilityOption ? currentVisibilityOption.label : ""}
        </Typography>
      </SelectTrigger>
      <SelectContent className="max-w-[420px]" side="bottom">
        {visibilityProperties.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            <Typography
              state={value === currentVisibility ? "active" : "default"}
              className="text-[16px]"
            >
              {label}
            </Typography>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}, "PostAdditionalForm")
