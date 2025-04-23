import { useEffect, useRef, useState } from "react";
import { Typography } from "@repo/ui/src/components/typography";
import { useNavigate } from "@tanstack/react-router"

type UserNotExistCounterProps = {
  redirectTimeout: string;
  redirectUser: string;
};

export const UserNotExistCounter = ({
  redirectTimeout,
  redirectUser,
}: UserNotExistCounterProps) => {
  const [seconds, setSeconds] = useState<number>(parseInt(redirectTimeout));
  const navigate = useNavigate();
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!seconds) {
      navigate({ to: `/user/${redirectUser}` });
      return;
    }

    // @ts-ignore
    timerIdRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerIdRef.current!);

          navigate({ to: `/user/${redirectUser}` });
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [seconds, redirectUser]);

  if (!redirectUser || !redirectTimeout) return;

  return (
    <div className="flex flex-col">
      <Typography>{seconds} секунд до редиректа на ваш профиль...</Typography>
    </div>
  );
};
