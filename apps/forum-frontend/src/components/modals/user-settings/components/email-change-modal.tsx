import { reatomComponent } from "@reatom/npm-react";
import { Typography } from "@repo/ui/src/components/typography";

export const EmailChangeModal = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 w-full">
      <Typography variant="dialogTitle">
        Смена почты
      </Typography>
      <div className="flex flex-col gap-y-2 w-full p-2">
        <Typography textSize="medium" textColor="shark_white">
          Для того чтобы сменить почту
        </Typography>
        <Typography textSize="medium">

        </Typography>
      </div>
    </div>
  );
}, "EmailChangeModal")