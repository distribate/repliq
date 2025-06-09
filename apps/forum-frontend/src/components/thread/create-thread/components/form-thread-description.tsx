import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent } from "react";
import { threadFormDescriptionAtom } from "../models/thread-form.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { action } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";

const onChange = action(async (ctx, e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  await ctx.schedule(() => sleep(300))
  threadFormDescriptionAtom(ctx, value)
}).pipe(withConcurrency())

export const FormThreadDescription = reatomComponent(({ ctx }) => {
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
        onChange={e => onChange(ctx, e)}
      />
    </div>
  );
}, "FormThreadDescription")