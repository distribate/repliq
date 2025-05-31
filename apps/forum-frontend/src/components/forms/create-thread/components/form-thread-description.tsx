import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent } from "react";
import { threadFormDescriptionAtom } from "../models/thread-form.model.ts";
import { reatomComponent } from "@reatom/npm-react";

export const FormThreadDescription = reatomComponent(({ ctx }) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {

    threadFormDescriptionAtom(ctx, e.target.value)
  };

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Описание
        </Typography>
      </div>
      <Input
        autoComplete="off"
        variant="form"
        className="rounded-md"
        placeholder="Напишите что-нибудь..."
        status={
          // errors ? "error" : 
          "default"
        }
        onChange={e => handleChange(e)}
      />
      {/* {errors.description && (
        <span className="text-red-600 text-[16px] font-normal">
          {errors.description.message}
        </span>
      )} */}
    </div>
  );
}, "FormThreadDescription")