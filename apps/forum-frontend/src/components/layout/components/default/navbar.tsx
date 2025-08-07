import { Avatar } from "#components/user/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography";
import { Plus } from "lucide-react"
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { UserMenu } from "#components/user/menu/components/user-menu";
import { CustomLink } from "#components/shared/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { AuthorizationButton } from "./authorization-button";
import { IconBell, IconBrandThreads, IconLibrary } from "@tabler/icons-react";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { getUser, userGlobalOptionsAtom } from "#components/user/models/current-user.model";
import { NavbarSearch } from "./navbar-search";
import { isExperimentalDesignAtom } from "./experimental-layout";

const CREATE = [
  { icon: IconBrandThreads, title: "Создать тред", link: "/create-thread" },
  { icon: IconLibrary, title: "Открыть тикет", link: "/create-ticket" }
]

const ProfileBadge = reatomComponent(({ ctx }) => {
  const { nickname, avatar } = getUser(ctx)

  return (
    <div className="flex items-center justify-between w-fit h-10 px-2 py-1 gap-3 bg-shark-950 rounded-lg">
      <Avatar url={avatar} rounded="medium" propHeight={32} className="min-w-[32px] min-h-[32px]" propWidth={32} nickname={nickname} />
      <MenuArrow />
    </div>
  )
}, "ProfileBadge")

const ActionsLinks = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom) || ctx.spy(isExperimentalDesignAtom)) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-2 gap-1 rounded-lg justify-center h-10 bg-shark-950 group">
        <Plus size={24} className="text-shark-300" />
        <MenuArrow />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <div className="flex flex-col gap-2 w-full h-full">
          {CREATE.map(({ icon: Icon, title, link }) => (
            <CustomLink key={title} to={link}>
              <DropdownMenuItem className="gap-2 pr-6 py-2 w-full cursor-pointer">
                <Icon size={20} className="text-shark-300" />
                <Typography textSize="medium">{title}</Typography>
              </DropdownMenuItem>
            </CustomLink>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

const NavbarUserMenu = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return <AuthorizationButton />

  return <UserMenu trigger={<ProfileBadge />} />
})

export const Logotype = () => {
  return (
    <CustomLink to="/home" className="flex items-center gap-1 justify-center w-full select-none">
      <img src="/logotype.png" width={32} height={32} alt="" className="min-w-10 min-h-10" draggable={false} />
      <div className="hidden md:block w-fit ml-1">
        <Typography textSize="very_big" font="pixy" textColor="shark_white" className="leading-7 truncate">
          Repliq
        </Typography>
      </div>
    </CustomLink>
  );
};

const NavbarNotifications = reatomComponent(({ ctx }) => {
  const has_new_notifications = ctx.spy(userGlobalOptionsAtom).has_new_notifications;

  return (
    <CustomLink
      to="/notifications"
      className="flex items-center gap-1 rounded-lg justify-center min-w-10 min-h-10 relative bg-shark-950"
    >
      {has_new_notifications && <div className="absolute bottom-2.5 right-2 w-2 h-2 rounded-lg bg-green-400/60" />}
      <IconBell size={20} className="text-shark-300" />
    </CustomLink>
  )
}, "NavbarNotifications")

export const Navbar = () => {
  return (
    <div id="top-bar" className="flex items-center justify-between w-full gap-2">
      <div className="flex md:w-fit h-10 rounded-lg py-1">
        <Logotype />
      </div>
      <div className="flex w-fit md:self-end items-center gap-2">
        <NavbarSearch />
        <ActionsLinks />
        <NavbarNotifications />
        <NavbarUserMenu />
      </div>
    </div>
  )
}