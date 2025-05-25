import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Controller } from "react-hook-form";
import { Toggle } from "@repo/ui/src/components/toggle.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { FormChildsProps } from "./form-thread.tsx";
import { reatomComponent } from "@reatom/npm-react";

export const FormThreadPermissions = reatomComponent<FormChildsProps>(({ ctx, errors, control }) => {
  const permission = false

  return (
    <FormField errorMessage={errors?.permission?.message}>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large">
            Хайд
          </Typography>
          <Typography textColor="gray" textSize="medium">
            (просмотр поста за валюту)
          </Typography>
        </div>
        <Controller
          control={control}
          name="permission"
          render={({ field: { onChange } }) => {
            return (
              <Toggle
                defaultPressed={permission || false}
                onPressedChange={(checked: boolean) => {
                  onChange(checked);
                  // threadFormAtom(ctx, (state) => ({...state, permission: checked}))
                }}
              >
                <Typography
                  textColor={permission ? "shark_black" : "shark_white"}
                  textSize="medium"
                >
                  {permission ? "включено" : "выключено"}
                </Typography>
              </Toggle>
            );
          }}
        />
      </div>
    </FormField>
  );
}, "FormThreadPermissions")