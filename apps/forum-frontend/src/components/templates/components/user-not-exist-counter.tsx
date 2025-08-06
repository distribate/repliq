import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { TimerAtom, reatomTimer } from '@reatom/timer'
import { atom } from "@reatom/core";
import { createIdLink } from "@repo/lib/utils/create-link";

const redirectTimer = reatomTimer({
  name: 'redirectAtom',
  interval: 1000,
  delayMultiplier: 1,
  progressPrecision: 2,
  resetProgress: true
})

const remainsAtom = (timer: TimerAtom) => atom((ctx) => {
  const progress = ctx.spy(timer.progressAtom);

  return Math.round((1 - progress) * 5);
}, `redirectTimer.remains`)

export const UserNotExistCounter = reatomComponent<{ redirectUser: string }>(({
  ctx, redirectUser
}) => {
  const remains = ctx.spy(remainsAtom(redirectTimer));

  useUpdate((ctx) => {
    redirectTimer.startTimer(ctx, 5000);

    const unsubscribe = redirectTimer.endTimer.onCall((ctx) => {
      const to = redirectUser ? createIdLink("user", redirectUser) : "/";
      window.location.replace(to)
      // router.navigate({ to });
    });

    return () => {
      redirectTimer.stopTimer(ctx);
      unsubscribe();
    };
  }, [redirectUser]); 

  return (
    <div className="flex flex-col">
      <Typography>
        {remains > 0
          ? `${remains} секунд до редиректа на ваш профиль`
          : 'Выполняется редирект...'
        }
      </Typography>
    </div>
  );
}, "UserNotExistCounter")