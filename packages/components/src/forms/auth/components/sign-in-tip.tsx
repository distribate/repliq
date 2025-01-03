"use client";

import { Typography } from "@repo/ui/src/components/typography.tsx";
import { AUTH_QUERY_KEY } from "#forms/auth/queries/auth-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SignInTip = () => {
  const qc = useQueryClient();
  const { replace } = useRouter();

  const handleRedirect = () => {
    replace("/auth?type=register");
    return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return (
    <div className="flex flex-col mt-0 lg:mt-6 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Typography
          textSize="medium"
          textShadow="small"
          className="font-semibold text-red-800"
        >
          Внимание!
        </Typography>
        <Typography
          textSize="medium"
          textColor="shark_black"
          textShadow="small"
          className="font-normal"
        >
          Никнейм чувствителен к регистру, то есть ты должен вводить игровой ник
          точь-в-точь с заглавными буквами (если они есть).
        </Typography>
      </div>
      <div className="w-full overflow-hidden">
        <Typography
          textSize="medium"
          variant="link"
          textColor="shark_black"
          onClick={handleRedirect}
        >
          У меня нет аккаунта. Зарегистрироваться.
        </Typography>
      </div>
    </div>
  );
};
