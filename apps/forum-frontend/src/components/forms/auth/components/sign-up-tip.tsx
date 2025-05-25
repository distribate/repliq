import { Typography } from "@repo/ui/src/components/typography.tsx";
import { changeAuthTypeAction } from "#components/forms/auth/models/auth.model";
import { reatomComponent } from "@reatom/npm-react";

export const SignUpTip = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col mt-0 lg:mt-6 gap-y-4">
      <Typography textShadow="small" textColor="shark_black" className="text-[15px] md:text-[18px] font-normal">
        Зарегистрируйся на проекте, чтобы создавать свой контент, общаться с
        игроками и строить свою игру!
      </Typography>
      <div className="flex flex-col gap-y-1">
        <Typography textShadow="small" textSize="medium" className="font-semibold text-red-800">
          Обрати внимание
        </Typography>
        <Typography textShadow="small" className="text-[15px] md:text-[18px] font-normal" textColor="shark_black">
          Никнейм чувствителен к регистру, то есть ты должен ввести игровой ник
          учитывая заглавные буквы (если они есть).
        </Typography>
      </div>
      <div className="w-full overflow-hidden">
        <Typography
          onClick={() => changeAuthTypeAction(ctx)}
          textColor="shark_black"
          className="text-[15px] md:text-[18px] font-normal"
          variant="link"
        >
          У меня уже есть аккаунт. Войти.
        </Typography>
      </div>
    </div>
  );
}, "SignUpTip")