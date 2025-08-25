import { logoutModalIsOpenAtom } from "#components/modals/action-confirmation/components/logout/models/logout.model";
import { toggleGlobalDialogAction } from "#components/modals/user-settings/models/user-settings.model";
import { CustomLink } from "#shared/components/link";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { currentUserAtom, userGlobalOptionsAtom } from "#components/user/models/current-user.model";
import { UserNickname } from "#components/user/components/name/nickname";
import { reatomComponent } from "@reatom/npm-react";
import { createIdLink } from "#lib/create-link";
import { Separator } from "@repo/ui/src/components/separator";
import { Typography } from "@repo/ui/src/components/typography";
import { IconArrowRight, IconBookmark, IconBrandThreads, IconLayoutDashboard, IconLibrary, IconLogout, IconSettings, IconUsersGroup } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { Shield } from "lucide-react";

const ProfileBadge = reatomComponent(({ ctx }) => {
  const currentUser = ctx.spy(currentUserAtom);
  if (!currentUser) return null;

  const { avatar, nickname } = currentUser

  return (
    <CustomLink to={createIdLink("user", nickname)} className="flex justify-between bg-shark-900 items-center rounded-lg p-4 w-full">
      <div className="flex gap-4 items-center w-fit">
        <div className="rounded-2xl overflow-hidden min-h-[56px] min-w-[56px] h-[56px] w-[56px]">
          <Avatar
            url={avatar}
            nickname={nickname}
            propHeight={56}
            propWidth={56}
            className="min-h-[56px] min-w-[56px]"
          />
        </div>
        <div className="flex flex-col h-full">
          <UserNickname nickname={nickname} className="text-lg leading-5" />
          <span className='text-shark-300 text-sm'>перейти в профиль</span>
        </div>
      </div>
      <IconArrowRight size={24} className="text-shark-300" />
    </CustomLink>
  )
}, "ProfileBadge")

const itemVariant = cva(`flex items-center cursor-pointer gap-2 bg-shark-950 rounded-lg p-3 w-full`)

const Logout = reatomComponent(({ ctx }) => {
  const handle = () => {
    requestAnimationFrame(() => logoutModalIsOpenAtom(ctx, true));
  }

  return (
    <div
      onClick={handle}
      className={itemVariant()}
    >
      <IconLogout size={20} className="text-red-600" />
      <Typography>
        Выйти
      </Typography>
    </div>
  )
}, "Logout")

const LINKS = [
  {
    title: "Друзья",
    value: "/friends",
    icon: IconUsersGroup
  },
  {
    title: "Треды",
    value: "/collection?type=threads",
    icon: IconBrandThreads
  },
  {
    title: "Тикеты",
    value: "/collection?type=tickets",
    icon: IconLibrary
  },
  {
    title: "Сохраненные треды",
    value: "/collection?type=saved_threads",
    icon: IconBookmark
  },
  {
    title: "Статистика",
    value: "/dashboard",
    icon: IconLayoutDashboard
  },
]

const Links = reatomComponent(({ ctx }) => {
  const isAdmin = ctx.get(userGlobalOptionsAtom).is_admin

  return (
    <>
      {LINKS.map((link) => (
        <CustomLink key={link.value} to={link.value} className={itemVariant()}>
          <link.icon size={20} className="text-shark-300" />
          <Typography textSize="medium">
            {link.title}
          </Typography>
        </CustomLink>
      ))}
      {isAdmin && (
        <>
          <CustomLink to="/admin" className={itemVariant()}>
            <Shield size={20} className="text-shark-300" />
            <Typography textSize="medium">
              Панель админа
            </Typography>
          </CustomLink>
        </>
      )}
    </>
  )
}, "Links")

const Settings = reatomComponent(({ ctx }) => {
  const handle = () => {
    requestAnimationFrame(() => toggleGlobalDialogAction(ctx, { reset: true, value: true }));
  }

  return (
    <div className={itemVariant()} onClick={handle}>
      <IconSettings size={20} className="text-shark-300" />
      <Typography textSize="medium">Настройки</Typography>
    </div >
  )
}, "Settings")

export default function MenuPage() {
  return (
    <>
      <div className="flex flex-col gap-4 w-full h-full">
        <Typography className="text-3xl font-bold">
          Меню
        </Typography>
        <ProfileBadge />
        <div className="flex flex-col gap-2">
          <Links />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Settings />
          <Logout />
        </div>
      </div>
    </>
  )
}