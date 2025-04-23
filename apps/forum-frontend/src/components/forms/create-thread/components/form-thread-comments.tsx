import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Controller } from "react-hook-form";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { threadFormQuery } from "../queries/thread-form-query.ts";
import { FormChildsProps } from "./form-thread.tsx";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { useEditThread } from "../hooks/use-edit-thread.tsx";

export const FormThreadComments = ({ errors, control }: FormChildsProps) => {
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useEditThread();

  if (!threadFormState) return null;

  const isActive = threadFormState.is_comments;

  return (
    <FormField errorMessage={errors?.is_comments?.message}>
      <div className="flex items-center justify-between w-full gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large" className="text-semibold">
            Комментирование
          </Typography>
          <Typography textColor="gray" textSize="medium">
            возможность комментировать пост
          </Typography>
        </div>
        <Controller
          control={control}
          name="is_comments"
          render={({ field: { onChange } }) => {
            return (
              <Switch
                defaultChecked={isActive}
                checked={isActive}
                onCheckedChange={(checked) => {
                  onChange(checked);

                  return updateThreadFormMutation.mutate({
                    is_comments: checked,
                  });
                }}
              />
            );
          }}
        />
      </div>
    </FormField>
  );
};
