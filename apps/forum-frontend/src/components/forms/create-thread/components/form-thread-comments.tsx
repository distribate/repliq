import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { threadFormPreferencesAtom } from "../models/thread-form.model.ts";

export const FormThreadComments = reatomComponent(({ ctx }) => {
  const is_comments = ctx.spy(threadFormPreferencesAtom).is_comments

  return (
    <FormField>
      <div className="flex items-center justify-between w-full gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large" className="text-semibold">
            Комментирование
          </Typography>
          <Typography textColor="gray" textSize="medium">
            возможность комментировать пост
          </Typography>
        </div>
        <Switch
          defaultChecked={is_comments}
          checked={is_comments}
          onCheckedChange={(checked) => {
            threadFormPreferencesAtom(ctx, (state) => ({ ...state, is_comments: checked }))
          }}
        />
      </div>
    </FormField>
  );
}, "FormThreadComments")