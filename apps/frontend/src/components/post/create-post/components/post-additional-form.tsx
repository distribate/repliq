import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@repo/ui/src/components/select.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { POST_VISIBILITY_INITIAL, postFormVisibilityAtom, VisibilityPost } from "../models/post-form.model.ts";
import { Eye } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { visibilityProperties } from "../models/create-post.model.ts";

const CurrentVisibilityOption = reatomComponent(({ ctx }) => {
  const currentVisibilityOption = visibilityProperties.find((option) => option.value === ctx.spy(postFormVisibilityAtom));

  return (
    <Typography className="text-[16px]" textColor="gray">
      {currentVisibilityOption ? currentVisibilityOption.label : ""}
    </Typography>
  )
}, "CurrentVisibilityOption")

const PostVisibilityOptions = reatomComponent(({ ctx }) => {
  return (
    visibilityProperties.map(({ value, label }) => (
      <SelectItem key={value} value={value}>
        <Typography
          state={value === ctx.spy(postFormVisibilityAtom) ? "active" : "default"}
          className="text-[16px]"
        >
          {label}
        </Typography>
      </SelectItem>
    ))
  )
}, "PostVisibilityOptions")

export const PostAdditionalForm = reatomComponent(({ ctx }) => {
  return (
    <Select
      defaultValue={POST_VISIBILITY_INITIAL}
      onValueChange={(value: VisibilityPost) => postFormVisibilityAtom(ctx, value)}
    >
      <SelectTrigger className="px-2 w-fit border border-shark-700/40 gap-2 items-center">
        <Eye size={18} className="text-shark-300" />
        <CurrentVisibilityOption />
      </SelectTrigger>
      <SelectContent className="max-w-[420px]" side="bottom">
        <PostVisibilityOptions/>
      </SelectContent>
    </Select>
  );
}, "PostAdditionalForm")