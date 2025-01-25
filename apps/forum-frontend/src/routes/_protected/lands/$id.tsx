import { Avatar } from '@repo/components/src/user/components/avatar/components/avatar'
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import dayjs from '@repo/lib/constants/dayjs-instance'
import { landsClient } from '@repo/shared/api/minecraft-client'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/src/components/tabs'
import { Typography } from '@repo/ui/src/components/typography'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import Looking from '@repo/assets/images/looking.jpg'
import { UserNickname } from '@repo/components/src/user/components/name/nickname'
import { USER_URL } from '@repo/shared/constants/routes'

export const Route = createFileRoute('/_protected/lands/$id')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ['lands', params.id],
      queryFn: () => getLandById(params.id),
    })

    return {
      title: data?.name ?? 'Загрузка...',
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title}`,
      },
    ],
  }),
})

async function getLandById(id: string) {
  const res = await landsClient.lands['get-land'][':id'].$get({
    param: { id },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null

  return data
}

const landsQuery = (id: string) =>
  useQuery({
    queryKey: ['lands', id],
    queryFn: () => getLandById(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

function RouteComponent() {
  const { id } = Route.useParams()
  const { data: land } = landsQuery(id)

  if (!land) return null

  return (
    <div className="flex items-start gap-4 w-full h-screen">
      <BlockWrapper className="flex flex-col gap-4 w-3/5 !p-4">
        <Tabs
          defaultValue="general"
          className="flex items-start flex-col w-full"
        >
          <TabsList>
            <TabsTrigger value="general">
              <Typography>Основное</Typography>
            </TabsTrigger>
            <TabsTrigger value="members">
              <Typography>
                Участники ({land.members.length}/{land.limits.MEMBERS})
              </Typography>
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Typography>Статистика</Typography>
            </TabsTrigger>
            <TabsTrigger value="chunks">
              <Typography>Территории</Typography>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="general"
            className="flex flex-col pt-2 gap-2 w-full h-full"
          >
            <div className="flex flex-col">
              <Typography className="text-[24px] font-semibold font-[Minecraft]">
                {land.name} {land.title ? `(${land.title})` : null}
              </Typography>
            </div>
            <div className="flex flex-col gap-4 h-full w-full">
              <Typography className="text-[18px]">
                Создана: {dayjs(land.created_at).format('DD.MM.YYYY HH:mm')}
              </Typography>
              <Typography className="text-[18px]">Тип: {land.type}</Typography>
            </div>
          </TabsContent>
          <TabsContent
            value="members"
            className="flex flex-col pt-2 gap-4 w-full"
          >
            <Typography className="text-[19px]" textColor="gray">
              Участники территории
            </Typography>
            <div className="flex flex-col gap-2 w-full h-full">
              {land.members.map(({ uuid, nickname }) => (
                <div
                  key={uuid}
                  className="flex w-full items-end gap-2 rounded-md p-2 hover:bg-shark-700"
                >
                  <Link to={USER_URL + nickname}>
                    <Avatar
                      nickname={nickname}
                      propWidth={64}
                      propHeight={64}
                    />
                  </Link>
                  <Link to={USER_URL + nickname}>
                    <UserNickname nickname={nickname} />
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="chunks"
            className="flex flex-col pt-2 gap-4 w-full"
          >
            <Typography className="text-[19px]" textColor="gray">
              Здесь отображается количество чанков и созданных областей внутри
              территории
            </Typography>
            <div className="flex flex-col gap-2 w-full h-full">
              <Typography className="text-[18px]">
                Чанков захвачено: {land.chunks_amount}
              </Typography>
              <Typography className="text-[18px]">
                Областей внутри территории: {land.areas_amount}
              </Typography>
            </div>
            <div className="flex items-center gap-4 w-full h-full">
              <Link
                target="_blank"
                // @ts-ignore
                to={`https://map.fasberry.su/`}
                className="flex items-center justify-center px-6 py-2 rounded-md bg-shark-800"
              >
                <Typography>Перейти к карте территории</Typography>
              </Link>
            </div>
          </TabsContent>
          <TabsContent
            value="stats"
            className="flex flex-col pt-2 gap-4 w-full h-full"
          >
            <Typography className="text-[19px]" textColor="gray">
              Здесь отображается основная статистика территории
            </Typography>
            <div className="flex flex-col gap-2 w-full h-full">
              <Typography className="text-[18px]">
                Убийств: {land.stats.kills}
              </Typography>
              <Typography className="text-[18px]">
                Смертей: {land.stats.deaths}
              </Typography>
              <Typography className="text-[18px]">
                Побед: {land.stats.wins}
              </Typography>
              <Typography className="text-[18px]">
                Захватов: {land.stats.captures}
              </Typography>
              <Typography className="text-[18px]">
                Поражений: {land.stats.defeats}
              </Typography>
            </div>
          </TabsContent>
        </Tabs>
      </BlockWrapper>
      <div className="flex flex-col items-center overflow-hidden justify-start gap-4 w-2/5 h-full">
        <BlockWrapper className="flex flex-col items-center overflow-hidden justify-end relative !p-0 gap-4 w-full">
          <div className="absolute h-1/3 bg-gradient-to-t rounded-md from-black/40 z-[1] via-black/40 to-transparent backdrop-blur-sm w-full bottom-0" />
          <img
            src={Looking}
            width={600}
            height={600}
            alt=""
            className="absolute w-full h-[400px] object-cover"
          />
          <div className="flex flex-col items-center justify-end gap-2 z-[2] pb-2 w-full h-[300px]">
            <Avatar
              nickname={land.members[0].nickname}
              propWidth={128}
              propHeight={128}
            />
            <Typography className="text-[24px] font-semibold font-[Minecraft]">
              {land.name}
            </Typography>
          </div>
        </BlockWrapper>
        <BlockWrapper className="flex flex-col items-center overflow-hidden justify-end !p-4 gap-4 w-full">
          <Typography className="text-[20px] font-semibold">
            Территории владельца этой территории:
          </Typography>
          <Typography>пусто.</Typography>
        </BlockWrapper>
      </div>
    </div>
  )
}
