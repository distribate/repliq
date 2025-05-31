import { ProfileAccountSocials } from "./profile-account-socials";
import { ProfileAccountReferals } from "./profile-account-refs";
import { SectionPrivatedContent } from "#components/templates/components/section-privated-content";
import { ProfileAccountStats } from "./profile-account-stats-list";
import { ProfileWrapper } from "#components/wrappers/components/profile-wrapper";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { Link2 } from "lucide-react";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { atom, AtomMut } from "@reatom/core";
import { sleep } from "@reatom/framework";
import { WindowLoader } from "@repo/ui/src/components/window-loader";
import { toast } from "sonner";

type Integration = "minecraft"

const connectionIsPendingAtom = atom(false, "connectionIsPending")

type ConnectedService = {
  id: Integration,
  details: {
    nickname: string,
    avatar: string
  }
}

const usersConnectedServicesAtom = atom<ConnectedService[]>([], "usersConnectedServices")
const minecraftServiceIsConnectedAtom = atom(false, "minecraftServiceIsConnected")

usersConnectedServicesAtom.onChange((ctx, state) => {
  if (!state.length) return;

  minecraftServiceIsConnectedAtom(ctx, state.some(service => service.id === "minecraft"))
})

const connectIntegrationAction = reatomAsync(async (ctx, type: Integration) => {
  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  connectionIsPendingAtom(ctx, true)

  await sleep(5000)
  connectionIsPendingAtom(ctx, false)
}, {
  name: "connectIntegrationAction",
  onFulfill: (ctx, res) => {
    toast.error("Не удалось инициировать подключение, попробуйте позже")
  }
}).pipe(withStatusesAtom())

type IntegrationItemProps = {
  title: string, 
  description: string, 
  type: Integration, 
  serviceAtom: AtomMut<boolean>
}

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
      {ctx.spy(serviceAtom) ? (
        <div className="flex items-center justify-start gap-4 w-full">
          <Button
            onClick={() => connectIntegrationAction(ctx, type)}
            className="gap-2 px-4 w-fit"
            disabled={ctx.spy(connectionIsPendingAtom)}
            variant="positive"
          >
            <Typography className="text-shark-50" textSize="medium">
              Подключено
            </Typography>
          </Button>
          <Button
            onClick={() => connectIntegrationAction(ctx, type)}
            className="gap-2 px-4 w-fit"
            disabled={ctx.spy(connectionIsPendingAtom)}
            variant="negative"
          >
            <Typography className="text-shark-50" textSize="medium">
              Отключить
            </Typography>
            {ctx.spy(connectionIsPendingAtom) ? (
              <WindowLoader size="small" className="invert" />
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

const ProfileAccountIntegrations = () => {
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
        <IntegrationItem
          title="Майнкрафт сервер Fasberry"
          description="Подключите профиль с сервера Fasberry для отображения вашей активности и достижений."
          serviceAtom={minecraftServiceIsConnectedAtom}
          type="minecraft"
        />
      </div>
    </div>
  )
}

export const UserProfileAccount = () => {
  return (
    <ProfileWrapper header={<SectionPrivatedContent />}>
      <div className="flex flex-col gap-y-8 w-full h-full">
        <ProfileAccountStats />
        <ProfileAccountIntegrations />
        <ProfileAccountSocials />
        <ProfileAccountReferals />
      </div>
    </ProfileWrapper>
  );
};