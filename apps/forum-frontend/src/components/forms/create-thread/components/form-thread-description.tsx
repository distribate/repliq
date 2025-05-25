import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Controller } from "react-hook-form";
import { ChangeEvent } from "react";
import { FormChildsProps } from "./form-thread.tsx";
import { threadFormDescriptionAtom } from "../models/thread-form.model.ts";
import { reatomComponent } from "@reatom/npm-react";

export const FormThreadDescription = reatomComponent<FormChildsProps>(({ ctx, control, errors }) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void,
  ) => {
    onChange(e);
    threadFormDescriptionAtom(ctx,  e.target.value)
  };

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Описание
        </Typography>
      </div>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, name, ref } }) => (
          <Input
            name={name}
            autoComplete="off"
            ref={ref}
            variant="form"
            className="rounded-md"
            placeholder="Напишите что-нибудь..."
            status={errors ? "error" : "default"}
            onChange={e => handleChange(e, onChange)}
          />
        )}
      />
      {errors.description && (
        <span className="text-red-600 text-[16px] font-normal">
          {errors.description.message}
        </span>
      )}
    </div>
  );
}, "FormThreadDescription")