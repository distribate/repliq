import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { FormChildsProps } from "./form-thread.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";

// @ts-ignore
export const FormThreadAutoRemove = reatomComponent<FormChildsProps>(({ 
  ctx, control, errors
}) => {
  const threadFormState = false;

  if (!threadFormState) return;

  const isActive = false

  return (
    <FormField>
      {/*  todo  */}
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large">
            Авто-удаление
          </Typography>
          <Typography textColor="gray" textSize="medium">
            (автоматическое удаление поста через заданное время)
          </Typography>
        </div>
        {/* <Controller
          control={control}
          name="auto_remove"
          render={({ field: { onChange } }) => {
            return (
              <Toggle
                defaultPressed={isActive || false}
                onPressedChange={(checked: boolean) => {
                  onChange(checked);

                  return updateThreadFormMutation.mutate({
                    auto_remove: checked,
                  });
                }}
              >
                <Typography
                  textColor={isActive ? "shark_black" : "shark_white"}
                  textSize="medium"
                >
                  {isActive ? "включено" : "выключено"}
                </Typography>
              </Toggle>
            );
          }}
        /> */}
      </div>
    </FormField>
  );
}, "FormThreadAutoRemove")