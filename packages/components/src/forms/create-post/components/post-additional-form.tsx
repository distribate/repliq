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
      <SelectTrigger className="!px-0 w-fit gap-2">
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
