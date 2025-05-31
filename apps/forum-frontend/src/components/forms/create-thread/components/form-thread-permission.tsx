import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Toggle } from "@repo/ui/src/components/toggle.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { reatomComponent } from "@reatom/npm-react";

export const FormThreadPermissions = reatomComponent(({ ctx }) => {
  const permission = false

  return (
    <FormField>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large">
            Хайд
          </Typography>
          <Typography textColor="gray" textSize="medium">
            (просмотр поста за валюту)
          </Typography>
        </div>
        <Toggle
          defaultPressed={permission || false}
          onPressedChange={(checked: boolean) => {

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
      </div>
    </FormField>
  );
}, "FormThreadPermissions")