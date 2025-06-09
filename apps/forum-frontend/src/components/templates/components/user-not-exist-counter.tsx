import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { TimerAtom, reatomTimer } from '@reatom/timer'
import { atom } from "@reatom/core";
import { onDisconnect } from "@reatom/framework";
import { router } from "#main";
import { createIdLink } from "@repo/lib/utils/create-link";

const redirectDestinationAtom = atom<string | null>(null, "redirectDestination")

const redirectTimer = reatomTimer({
  name: 'redirectAtom',
  interval: 1000, 
  delayMultiplier: 1,
  progressPrecision: 2, 
  resetProgress: true
})

const remainsAtom = (timer: TimerAtom) => atom((ctx) => (1 - ctx.spy(timer.progressAtom)) * 100,`redirectTimer.remains`)

redirectTimer.endTimer.onCall(async (ctx) => {
  const destination = ctx.get(redirectDestinationAtom)

  if (destination) {
    router.navigate({ to: createIdLink("user", destination) });
  } else {
    router.navigate({ to: "/" });
  }
})

const SyncUpdateRedirect = ({ target }: { target: string | null }) => {
  useUpdate((ctx) => {
    redirectDestinationAtom(ctx, target)
    redirectTimer.startTimer(ctx, 5000)
  }, [])

  return null;
}

onDisconnect(redirectTimer, redirectTimer.stopTimer)

export const UserNotExistCounter = reatomComponent<{ redirectUser: string }>(({
  ctx, redirectUser
}) => {
  return (
    <div className="flex flex-col">
      <SyncUpdateRedirect target={redirectUser} />
      <Typography>
        {ctx.spy(remainsAtom(redirectTimer))} секунд до редиректа на ваш профиль
      </Typography>
    </div>
  );
}, "UserNotExistCounter")