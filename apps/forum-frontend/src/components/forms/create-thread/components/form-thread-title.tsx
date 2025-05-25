import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Controller } from "react-hook-form";
import { FormChildsProps } from "./form-thread.tsx";
import { threadFormTitleAtom } from "../models/thread-form.model.ts";
import { reatomComponent } from "@reatom/npm-react";

export const FormThreadTitle = reatomComponent<FormChildsProps>(({ ctx, control, errors }) => {
  return (
    <div className="flex flex-col gap-y-1 w-full">
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Заголовок <span className="text-red-500">*</span>
        </Typography>
      </div>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, name, ref } }) => (
          <Input
            name={name}
            ref={ref}
            autoComplete="off"
            variant="form"
            className="rounded-md"
            placeholder="Напишите что-нибудь..."
            status={errors ? "error" : "default"}
            onChange={(e) => {
              onChange(e);
              threadFormTitleAtom(ctx, e.target.value)
            }}
          />
        )}
      />
      {errors.title && (
        <span className="text-red-600 text-[16px] font-normal">
          {errors.title.message}
        </span>
      )}
    </div>
  );
}, "FormThreadTitle")