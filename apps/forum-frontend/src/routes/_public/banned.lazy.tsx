import dayjs from '@repo/lib/constants/dayjs-instance'
import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute, redirect } from '@tanstack/react-router'
import Dirt from '@repo/assets/images/minecraft/dirt.webp'
import { BannedActionButton } from '@repo/components/src/buttons/banned-action-button.tsx'
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts'

async function checkIsBanned(nickname: string) {
  const isBanned = await getUserBanned(nickname)

  if (!isBanned || isBanned.nickname !== nickname) {
    return false
  }

  return true
}

export const Route = createLazyFileRoute('/_public/banned')({
  component: RouteComponent,
  beforeLoad: async ({
    params,
  }: {
    params: { nickname: string | undefined }
  }) => {
    const nickname = params.nickname

    if (!nickname) {
      return redirect({ to: '/' })
    }

    const isBanned = await checkIsBanned(nickname)

    if (!isBanned) {
      return redirect({ to: '/' })
    }

    return { nickname, isBanned }
  },
  loader: async ({ params }: { params: { nickname: string } }) => {
    const isBanned = await getUserBanned(params.nickname)

    return { isBanned }
  },
})

function RouteComponent() {
  const { isBanned } = Route.useLoaderData()

  return (
    <div className="flex w-full relative h-screen items-center justify-center">
      <div
        className="absolute w-full h-full brightness-[0.25]"
        style={{
          backgroundImage: `url(${Dirt})`,
        }}
      />
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
              Причина: <span className="text-shark-50">{isBanned?.reason}</span>
            </Typography>
            <Typography
              textSize="medium"
              className="brightness-100 font-semibold text-red-500"
            >
              Разбан:{' '}
              <span className="text-shark-50">
                {dayjs(isBanned?.time).format('DD.MM.YYYY HH:mm')}
              </span>
            </Typography>
          </div>
          <div className="w-full *:w-full">
            <BannedActionButton />
          </div>
        </div>
      </div>
    </div>
  )
}
