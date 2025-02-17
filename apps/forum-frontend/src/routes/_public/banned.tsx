import dayjs from '@repo/lib/constants/dayjs-instance'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute, redirect } from '@tanstack/react-router'
import Dirt from '@repo/assets/images/minecraft/dirt.webp'
import { BannedActionButton } from '@repo/components/src/buttons/banned-action-button.tsx'
import { useQuery } from '@tanstack/react-query'
import { createQueryKey } from '@repo/lib/helpers/query-key-builder'
import { getUserInformation } from '@repo/lib/queries/get-user-information'

export const BANNED_QUERY_KEY = createQueryKey("ui", ["banned"])

type BannedQuery = {
  reason: string
  time: string
  created_at: string
}

const bannedQuery = () => useQuery<BannedQuery, Error>({
  queryKey: BANNED_QUERY_KEY
})

type BannedSearch = BannedQuery

export const Route = createFileRoute('/_public/banned')({
  component: RouteComponent,
  loaderDeps: ({ search: { reason, time, created_at } }) => ({ reason, time, created_at }),
  loader: async ({ context: ctx, deps }) => {
    const isCurrent = await getUserInformation()
    
    if (isCurrent) {
      throw redirect({ to: "/" })
    }

    ctx.queryClient.setQueryData(BANNED_QUERY_KEY, deps)
  },
  validateSearch: (search: Record<string, unknown>): BannedSearch => {
    return {
      reason: search.reason as string ?? "нет",
      time: search.time as string ?? "",
      created_at: search.created_at as string ?? ""
    }
  }
})

function RouteComponent() {
  const { data } = bannedQuery()

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
    </div>
  )
}
