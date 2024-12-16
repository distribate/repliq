import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const RealNameChange = () => {
  const { real_name } = getUser();
  const { updateFieldMutation } = useUpdateCurrentUser();

  const { register, formState: { errors, isValid }, getValues, watch } = useForm({
    mode: "onChange",
    defaultValues: { real_name },
  });

  const value = watch("real_name");
  const isIdentity = value === real_name;

  const handleRealName = () => {
    const value = getValues("real_name");

    if (isIdentity) return;
    
    return updateFieldMutation.mutate({ criteria: "real_name", value, });
  };
  
  return (
    <div className="flex flex-col items-center gap-y-4 w-full">
      <Typography variant="dialogTitle">Смена реального имени</Typography>
      <div className="flex items-center justify-start w-full gap-1 px-4">
        <Typography>Текущее имя:</Typography>
        <Typography
          textShadow="small"
          textSize="medium"
          textColor="shark_white"
        >
          {real_name}
        </Typography>
      </div>
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <FormField>
          <Input
            placeholder="например: Абоба"
            className="!text-base"
            maxLength={25}
            backgroundType="transparent"
            {...register("real_name", { maxLength: 25 })}
          />
          {errors?.real_name && (
            <span className="text-red-500 text-sm px-4">{errors.real_name.message}</span>
          )}
        </FormField>
        <Button
          pending={updateFieldMutation.isPending}
          disabled={updateFieldMutation.isPending || !isValid || isIdentity}
          onClick={handleRealName}
        >
          <Typography textColor="shark_white">Сохранить</Typography>
        </Button>
      </div>
    </div>
  );
};
