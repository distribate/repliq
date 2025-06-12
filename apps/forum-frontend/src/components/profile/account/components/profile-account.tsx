import { ProfileAccountSocials } from "./profile-account-socials";
// import { ProfileAccountReferals } from "./profile-account-refs";
import { SectionPrivatedContent } from "#components/templates/components/section-privated-content";
import { ProfileAccountStats } from "./profile-account-stats-list";
import { ProfileWrapper } from "#components/wrappers/components/profile-wrapper";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { Link2 } from "lucide-react";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { atom, AtomMut } from "@reatom/core";
import { onConnect } from "@reatom/framework";
import { WindowLoader } from "@repo/ui/src/components/window-loader";
import { toast } from "sonner";
import { forumUserClient } from "@repo/shared/api/forum-client";
import dayjs from "@repo/lib/constants/dayjs-instance"
import { logger } from "@repo/lib/utils/logger";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { MinecraftAvatar } from "#components/user/minecraft-avatar/minecraft-avatar";

type Integration =
  | "minecraft"

const connectionIsPendingAtom = atom(false, "connectionIsPending")

const usersConnectedServiceAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getUsersConnectedServices())
}, "usersConnectedServiceAction").pipe(withDataAtom(), withStatusesAtom())

usersConnectedServiceAction.dataAtom.onChange((ctx, state) => {
  if (!state || !state.length) return;

  minecraftServiceIsConnectedAtom(ctx, state.some(service => service.id === "minecraft"))

  const minecraftService = state.find(service => service.id === "minecraft")?.details

  if (minecraftService) {
    minecraftServiceDetailsAtom(ctx, minecraftService)
  }
})

type MinecraftService = { nickname: string, created_at: string, uuid: string }

const minecraftServiceIsConnectedAtom = atom(false, "minecraftServiceIsConnected")
const minecraftServiceDetailsAtom = atom<MinecraftService | undefined>(undefined, "minecraftServiceDetails")

async function getUsersConnectedServices() {
  const res = await forumUserClient.user["get-profiles"].$get()
  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

async function connectProfile(type: Integration) {
  const res = await forumUserClient.user["connect-profile"].$post({
    json: { type }
  })

  const data = await res.json()

  if (!data) return null;

  return data
}

async function disconnectProfile(type: Integration) {
  // @ts-expect-error
  const res = await forumUserClient.user["disconnect-profile"].$post({
    json: { type }
  })

  const data = await res.json()
  if (!data) return null;

  return data
}

const disconnectIntegrationAction = reatomAsync(async (ctx, type: Integration) => {
  connectionIsPendingAtom(ctx, true)

  return await ctx.schedule(() => disconnectProfile(type))
}, {
  name: "disconnectIntegrationAction",
  onFulfill: (_, res) => {
    if (!res) return;

    if ("error" in res) {
      toast.error(res.error)
      return;
    }

    logger.info(res.data)

    toast.success("Профиль успешно отключен")
  },
  onSettle: (ctx) => {
    connectionIsPendingAtom(ctx, false)
  },
  onReject: (_, error) => {
    logger.error(error)
    toast.error("Произошла ошибка при отключении профиля")
  }
})

const connectIntegrationAction = reatomAsync(async (ctx, type: Integration) => {
  connectionIsPendingAtom(ctx, true)

  return await ctx.schedule(() => connectProfile(type))
}, {
  name: "connectIntegrationAction",
  onFulfill: (_, res) => {
    if (!res) return;

    if ("error" in res) {
      toast.error(res.error)
      return;
    }

    logger.info(res.data)

    toast.success("Профиль успешно подключен")
  },
  onSettle: (ctx) => {
    connectionIsPendingAtom(ctx, false)
  }
}).pipe(withStatusesAtom())

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
            className="flex items-center bg-shark-50 rounded-md justify-center h-full gap-2 px-4 w-fit"
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

const ProfileAccountIntegrations = reatomComponent(({ ctx }) => {
  const data = ctx.spy(usersConnectedServiceAction.dataAtom)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" textSize="big" className="font-semibold">
            Связанные аккаунты
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

export const UserProfileAccount = () => {
  return (
    <ProfileWrapper header={<SectionPrivatedContent />}>
      <div className="flex flex-col gap-y-8 w-full h-full">
        <ProfileAccountStats />
        <ProfileAccountIntegrations />
        <ProfileAccountSocials />
        {/* <ProfileAccountReferals /> */}
      </div>
    </ProfileWrapper>
  );
};