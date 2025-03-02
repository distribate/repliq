import { Typography } from "@repo/ui/src/components/typography.tsx";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { AUTH_QUERY_KEY } from "#components/forms/auth/queries/auth-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const SignUpTip = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate({ to: AUTH_REDIRECT });
    return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return (
    <div className="flex flex-col mt-0 lg:mt-6 gap-y-4">
      <Typography
        textShadow="small"
        textColor="shark_black"
        className="text-[15px] md:text-[18px] font-normal"
      >
        Зарегистрируйся на проекте, чтобы создавать свой контент, общаться с
        игроками и строить свою игру!
      </Typography>
      <div className="flex flex-col gap-y-1">
        <Typography
          textShadow="small"
          textSize="medium"
          className="font-semibold text-red-800"
        >
          Обрати внимание
        </Typography>
        <Typography
          textShadow="small"
          className="text-[15px] md:text-[18px] font-normal"
          textColor="shark_black"
        >
          Никнейм чувствителен к регистру, то есть ты должен ввести игровой ник
          учитывая заглавные буквы (если они есть).
        </Typography>
      </div>
      <div className="w-full overflow-hidden">
        <Typography
          onClick={handleRedirect}
          textColor="shark_black"
          className="text-[15px] md:text-[18px] font-normal"
          variant="link"
        >
          У меня уже есть аккаунт. Войти.
        </Typography>
      </div>
    </div>
  );
};
