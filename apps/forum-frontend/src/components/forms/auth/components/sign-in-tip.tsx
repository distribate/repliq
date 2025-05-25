import { Typography } from "@repo/ui/src/components/typography.tsx";
import { changeAuthTypeAction } from "#components/forms/auth/models/auth.model";
import { reatomComponent } from "@reatom/npm-react";

export const SignInTip = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col mt-0 lg:mt-6 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Typography textSize="medium" textShadow="small" className="font-semibold text-red-800">
          Внимание!
        </Typography>
        <Typography textColor="shark_black" textShadow="small" className="text-[15px] md:text-[18px] font-normal">
          Никнейм чувствителен к регистру, то есть ты должен вводить игровой ник
          точь-в-точь с заглавными буквами (если они есть).
        </Typography>
      </div>
      <div className="w-full overflow-hidden">
        <Typography
          variant="link"
          textColor="shark_black"
          onClick={() => changeAuthTypeAction(ctx)}
          className="text-[15px] md:text-[18px] font-normal"
        >
          У меня нет аккаунта. Зарегистрироваться.
        </Typography>
      </div>
    </div>
  );
}, "SignInTip")