import { AtomMut } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { Button } from "@repo/ui/src/components/button"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { WindowLoader } from "@repo/ui/src/components/window-loader"
import { Link2 } from "lucide-react"
import dayjs from "@repo/shared/constants/dayjs-instance"
import { onConnect } from "@reatom/framework"
import { 
  connectIntegrationAction, 
  connectionIsPendingAtom, 
  disconnectIntegrationAction, 
  Integration,
  minecraftServiceDetailsAtom, 
  minecraftServiceIsConnectedAtom, 
  usersConnectedServiceAction 
} from "../models/user-integration.model"
import { MinecraftAvatar } from "#components/profile/integrations/minecraft/minecraft"

type IntegrationItemProps = {
  title: string,
  description: string,
  type: Integration,
  serviceAtom: AtomMut<boolean>
}

const MinecraftDetails = reatomComponent(({ ctx }) => {
  const data = ctx.spy(minecraftServiceDetailsAtom)

  if (!data) return null;

  return (
    <div className="flex items-center gap-2 w-fit">
      <MinecraftAvatar nickname={data.nickname} propHeight={36} propWidth={36} />
      <div className="flex flex-col">
        <span className="text-base">{data.nickname}</span>
        <Typography textColor="gray">
          {dayjs(data.created_at).format("Привязан DD.MM.YYYY")}
        </Typography>
      </div>
    </div>
  )
}, "MinecraftDetails")

const IntegrationItem = reatomComponent<IntegrationItemProps>(({ ctx, title, description, type, serviceAtom }) => {
  return (
    <div className="flex flex-col gap-4 items-start p-4 w-fit bg-shark-950 rounded-lg">
      <div className="flex flex-col items-start gap-1">
        <Typography className="text-[18px] font-medium">
          {title}
        </Typography>
        <Typography textSize="small" textColor="gray">
          {description}
        </Typography>
      </div>
      {type === 'minecraft' && <MinecraftDetails />}
      {ctx.spy(serviceAtom) ? (
        <div className="flex items-center justify-start gap-2 w-full">
          <div
            className="flex select-none items-center bg-shark-50 rounded-md justify-center h-full gap-2 px-4 w-fit"
          >
            <Typography className="text-shark-900" textSize="medium">
              Подключено
            </Typography>
          </div>
          <Button
            onClick={() => disconnectIntegrationAction(ctx, type)}
            className="gap-2 px-4 w-fit"
            disabled={ctx.spy(connectionIsPendingAtom)}
            variant="negative"
          >
            <Typography className="text-shark-50" textSize="medium">
              Отключить
            </Typography>
            {ctx.spy(connectionIsPendingAtom) ? (
              <WindowLoader size="small" className="" />
            ) : (
              <Link2 size={18} className="text-shark-50" />
            )}
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => connectIntegrationAction(ctx, "minecraft")}
          className="gap-2 px-4 bg-shark-100 w-fit"
          disabled={ctx.spy(connectionIsPendingAtom)}
        >
          <Typography className="text-shark-900" textSize="medium">
            Подключить
          </Typography>
          {ctx.spy(connectionIsPendingAtom) ? (
            <WindowLoader size="small" className="invert" />
          ) : (
            <Link2 size={18} className="text-shark-900" />
          )}
        </Button>
      )}
    </div>
  )
}, "IntegrationAction")

onConnect(usersConnectedServiceAction.dataAtom, usersConnectedServiceAction)

export const ProfileAccountIntegrations = reatomComponent(({ ctx }) => {
  const data = ctx.spy(usersConnectedServiceAction.dataAtom)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" textSize="big" className="font-semibold">
            Привязанные сервисы
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-auto gap-4 w-full h-full">
        {ctx.spy(usersConnectedServiceAction.statusesAtom).isPending ? (
          <>
            <Skeleton className="h-36 w-full" />
          </>
        ) : (
          <>
            <IntegrationItem
              title="Майнкрафт сервер Fasberry"
              description="Подключите профиль с сервера Fasberry для отображения вашей активности и достижений."
              serviceAtom={minecraftServiceIsConnectedAtom}
              type="minecraft"
            />
          </>
        )}
      </div>
    </div>
  )
}, "ProfileAccountIntegrations")