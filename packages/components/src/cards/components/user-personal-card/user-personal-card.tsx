import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import Portfolio from "@repo/assets/images/minecraft/portfolio.webp";
import { TicketsModal } from "#modals/custom/tickets-modal.tsx";
import {
  UserProfileSettings,
  UserSettingOption,
} from "./components/profile-settings/user-profile-settings.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { UserSettingsCard } from "#cards/components/user-personal-card/components/account-settings/user-settings-card.tsx";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp";
import { UserAdvancedSettings } from "#cards/components/user-personal-card/components/advanced-settings/user-advanced-settings.tsx";
import Campfire from "@repo/assets/images/minecraft/campfire.webp";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp";
import GrassBlock from "@repo/assets/images/minecraft/grass_block.webp";
import FishingRod from "@repo/assets/images/minecraft/fishing_rod.webp";
import { Link } from "@tanstack/react-router";
import { userStatusQuery } from "@repo/lib/queries/user-status-query.ts";
import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { landsClient } from "@repo/shared/api/minecraft-client.ts";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

const getUserLands = async (nickname: string) => {
  const res = await landsClient.lands["get-user-lands"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data.length > 0 ? data.data : null
}

const userLandsQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey('user', ['lands', nickname]),
  queryFn: () => getUserLands(nickname),
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
})

const UserLands = () => {
  const currentUser = getUser();
  const { data: userLands, isLoading } = userLandsQuery(currentUser.nickname);

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Ваши регионы</Typography>
      <div className="flex flex-col w-full gap-y-4">
        {isLoading && (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        )}
        {(!userLands && !isLoading) && (
          <ContentNotFound title="Регионов пока нет :/" />
        )}
        {userLands && userLands?.map((land) => (
          <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
            <Typography className="text-base text-shark-200">
              {land.name}
            </Typography>
            <Typography className="text-base text-shark-200">
              {land.title}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}

const UserPersonalCardHeader = () => {
  const { nickname, name_color } = getUser();
  const { data: userStatus } = userStatusQuery(nickname);

  const isOnline = userStatus?.status;

  return (
    <>
      <Avatar propHeight={96} propWidth={96} nickname={nickname} />
      <div className="flex flex-col items-center">
        <UserNickname
          nickname={nickname}
          nicknameColor={name_color}
          className="text-base font-bold"
        />
        <Typography>
          {isOnline ? "в сети" : "не в сети"}
        </Typography>
      </div>
    </>
  );
};

export const UserPersonalCard = () => {
  return (
    <div className="flex flex-col gap-y-4 pt-4 items-center w-full">
      <UserPersonalCardHeader />
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Профиль" imageSrc={BookAndQuill} />
          </DialogTrigger>
          <DialogContent>
            <UserProfileSettings />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Аккаунт" imageSrc={MinecartWithChest} />
          </DialogTrigger>
          <DialogContent>
            <UserSettingsCard />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Прочее" imageSrc={Campfire} />
          </DialogTrigger>
          <DialogContent>
            <UserAdvancedSettings />
          </DialogContent>
        </Dialog>
        <Separator />
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Мои регионы" imageSrc={GrassBlock} />
          </DialogTrigger>
          <DialogContent>
            <UserLands />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Рейтинг" imageSrc={DragonBreath} />
          </DialogTrigger>
          <DialogContent>

          </DialogContent>
        </Dialog>
        <Separator />
        <Link to="https://fasberry.su/wiki" target="_blank">
          <UserSettingOption title="Вики" imageSrc={Portfolio} />
        </Link>
        <TicketsModal
          trigger={
            <UserSettingOption title="Задать вопрос" imageSrc={FishingRod} />
          }
        />
      </div>
    </div>
  );
};