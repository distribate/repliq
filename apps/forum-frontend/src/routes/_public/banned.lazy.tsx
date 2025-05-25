import dayjs from '@repo/lib/constants/dayjs-instance'
import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute, redirect } from '@tanstack/react-router'
import Dirt from '@repo/assets/images/minecraft/dirt.webp'
import { getUserInformation } from '@repo/lib/helpers/get-user'
import { logoutAction } from '#components/modals/action-confirmation/components/logout/models/logout.model'
import { Button } from '@repo/ui/src/components/button'
import { reatomComponent } from '@reatom/npm-react'
import { atom } from '@reatom/core'
import { reatomLoader } from '@repo/lib/utils/reatom-loader'

type Banned = {
  reason: string
  time: string
  created_at: string
}

const bannedAtom = atom<Banned | null>(null, "banned")

export const Route = createLazyFileRoute('/_public/banned')({
  component: RouteComponent,
  // @ts-ignore
  loaderDeps: ({ search: { reason, time, created_at } }) => ({ reason, time, created_at }),
  // @ts-ignore
  loader: reatomLoader(async (context, routerCtx) => {
    const isCurrent = await getUserInformation()

    if (isCurrent) {
      throw redirect({ to: "/" })
    }

    bannedAtom(context, routerCtx.deps)
  }),
  // @ts-ignore
  validateSearch: (search: Record<string, unknown>): Banned => {
    return {
      reason: search.reason as string ?? "нет",
      time: search.time as string ?? "",
      created_at: search.created_at as string ?? ""
    }
  }
})

const BannedActionButton = reatomComponent(({ ctx }) => {
  const isLoading = ctx.spy(logoutAction.statusesAtom).isPending;
  const isError = ctx.spy(logoutAction.statusesAtom).isRejected

  return (
    <Button
      rounded="none"
      variant="minecraft"
      state="default"
      disabled={isLoading || ctx.spy(logoutAction.statusesAtom).isFulfilled}
      pending={isLoading || isError}
      onClick={() => logoutAction(ctx)}
    >
      Выйти из аккаунта
    </Button>
  );
}, "BannedActionButton")

const Banned = reatomComponent(({ ctx }) => {
  const data = ctx.spy(bannedAtom)

  return (
    <div className="flex flex-col gap-y-4 items-center relative font-[Minecraft]">
      <Typography
        textSize="medium"
        className="brightness-100 font-semibold text-shark-300"
      >
        Соединение потеряно
      </Typography>
      <div className="flex flex-col items-center gap-y-4">
        <Typography
          textSize="medium"
          className="brightness-100 font-semibold text-red-500"
        >
          Вы были заблокированы на форуме.
        </Typography>
        <div className="flex flex-col items-center">
          <Typography
            textSize="medium"
            className="brightness-100 font-semibold text-red-500"
          >
            Причина: <span className="text-shark-50">{data?.reason}</span>
          </Typography>
          <Typography
            textSize="medium"
            className="brightness-100 font-semibold text-red-500"
          >
            Разбан:{' '}
            <span className="text-shark-50">
              {dayjs(data?.time).format('DD.MM.YYYY HH:mm')}
            </span>
          </Typography>
        </div>
        <div className="w-full *:w-full">
          <BannedActionButton />
        </div>
      </div>
    </div>
  )
})

function RouteComponent() {
  return (
    <div className="flex w-full relative h-screen items-center justify-center">
      <div
        className="absolute w-full h-full brightness-[0.25]"
        style={{
          backgroundImage: `url(${Dirt})`,
        }}
      />
      <Banned />
    </div>
  )
}
