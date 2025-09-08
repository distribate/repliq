import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { editThreadTitleOnChange } from "../models/thread-form.model.ts";
import { reatomComponent } from "@reatom/npm-react";

export const FormThreadTitle = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-1 w-full">
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Заголовок <span className="text-red-500">*</span>
        </Typography>
      </div>
      <Input
        autoComplete="off"
        variant="form"
        className="rounded-md"
        placeholder="Напишите что-нибудь..."
        onChange={(e) => editThreadTitleOnChange(ctx, e)}
      />
    </div>
  );
}, "FormThreadTitle")