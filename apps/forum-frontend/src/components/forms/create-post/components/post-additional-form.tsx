import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@repo/ui/src/components/select.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { usePostFormControl } from "../hooks/use-post-form-control.ts";
import { postFormQuery, VisibilityPost } from "../queries/post-form-query.ts";
import { visibilityProperties } from "../constants/visibility-properties.ts";
import { Eye } from "lucide-react";

export const PostAdditionalForm = () => {
  const { postFormFieldsMutation } = usePostFormControl();
  const { data: createPostFormState } = postFormQuery();
  const { visibility: currentVisibility } = createPostFormState;

  const handleVisiblityOption = (visibility: VisibilityPost) =>
    postFormFieldsMutation.mutate({ visibility });

  const currentVisibilityOption = visibilityProperties.find(
    (option) => option.value === currentVisibility,
  );

  return (
    <Select
      defaultValue={currentVisibility}
      onValueChange={(v: VisibilityPost) => handleVisiblityOption(v)}
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
};
