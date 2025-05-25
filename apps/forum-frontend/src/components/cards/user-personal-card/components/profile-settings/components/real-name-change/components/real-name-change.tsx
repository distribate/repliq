import { Input } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@repo/ui/src/components/dialog";
import { reatomComponent } from "@reatom/npm-react";
import { updateCurrentUserAction } from "../../../models/update-current-user.model";
import { spawn } from "@reatom/framework";

const realNameSchema = z.object({
  real_name: z.string().max(32).nullable(),
});

type RealNameSchemaType = z.infer<typeof realNameSchema>;

export const RealNameChange = reatomComponent(({ ctx }) => {
  const real_name = getUser(ctx).real_name;

  const { register, formState: { errors, isValid }, getValues, watch } = useForm<RealNameSchemaType>({
    resolver: zodResolver(realNameSchema),
    mode: "onChange",
    defaultValues: { real_name },
  });

  const value = watch("real_name");
  const isIdentity = (value === real_name) || (value === '' && real_name === null);

  const handleRealName = () => {
    let value = getValues("real_name");

    if (isIdentity) return;

    value = value ? value.length < 1 ? null : value : null

    void spawn(ctx, async (spawnCtx) => updateCurrentUserAction(spawnCtx, { criteria: "real_name", value }));
  };

  return (
    <div className="flex flex-col items-center gap-y-4 w-full">
      <Typography variant="dialogTitle">Смена имени</Typography>
      {real_name ? (
        <>
          <div className="flex items-center justify-start w-full gap-1 px-2">
            <Typography textColor="shark_white" textSize="large" >
              Текущее имя:
            </Typography>
            <Typography className="font-semibold" textSize="large" textColor="shark_white">
              {real_name}
            </Typography>
          </div>
          <Separator />
        </>
      ) : (
        <>
          <div className="flex items-center justify-start w-full gap-1 px-2">
            <Typography textColor="gray" textSize="large">
              Введите какое-нибудь имя в поле ниже...
            </Typography>
          </div>
          <Separator />
        </>
      )}
      <div className="flex flex-col gap-y-2 w-full px-2 pb-2">
        <FormField>
          <Input
            placeholder="Введите новое имя, например: Абоба"
            className="!text-base"
            maxLength={32}
            {...register("real_name", { maxLength: 32 })}
          />
          {errors?.real_name && (
            <span className="text-red-500 text-sm px-4">{errors.real_name.message}</span>
          )}
        </FormField>
        <div className="flex items-center w-full gap-2 pt-2 justify-end">
          <Button
            variant="positive"
            pending={ctx.spy(updateCurrentUserAction.statusesAtom).isPending}
            disabled={ctx.spy(updateCurrentUserAction.statusesAtom).isPending || !isValid || isIdentity}
            onClick={handleRealName}
          >
            <Typography textColor="shark_white">
              Сохранить
            </Typography>
          </Button>
          <DialogClose>
            <Button variant="negative">
              <Typography textColor="shark_white">
                Отменить
              </Typography>
            </Button>
          </DialogClose>
        </div>
      </div>
    </div>
  );
}, "RealNameChange")