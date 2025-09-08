import { Avatar } from "#components/user/components/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography";
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { UserMenu } from "#components/user/components/menu/components/user-menu";
import { CustomLink } from "#shared/components/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { AuthorizationButton } from "../../../shared/components/authorization-button";
import { IconBell, IconBrandThreads, IconLibrary, IconPlus } from "@tabler/icons-react";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { getUser, userGlobalOptionsAtom } from "#components/user/models/current-user.model";
import { NavbarSearch } from "./navbar-search";
import { usePageContext } from "vike-react/usePageContext";

const CREATE = [
  { icon: IconBrandThreads, title: "Создать тред", link: "/create-thread" },
  { icon: IconLibrary, title: "Открыть тикет", link: "/create-ticket" }
]

const ProfileBadge = reatomComponent(({ ctx }) => {
  const { nickname, avatar } = getUser(ctx)

  return (
    <div
      className="flex items-center justify-between w-fit h-10 px-2 py-1 gap-3 
      hover:bg-shark-900 duration-150 ease-out cursor-pointer bg-shark-950 rounded-lg"
    >
      <Avatar
        url={avatar}
        propHeight={32}
        propWidth={32}
        nickname={nickname}
        className="aspect-square h-8 min-h-8 max-h-8"
      />
      <MenuArrow />
    </div>
  )
}, "ProfileBadge")

const ActionsLinks = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center px-2 gap-1 rounded-lg justify-center h-10 hover:bg-shark-900 duration-150 ease-out cursor-pointer bg-shark-950"
      >
        <IconPlus size={24} className="text-shark-300" />
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
}

export const Logotype = () => {
  return (
    <CustomLink
      to="/home"
      className="flex items-center gap-2 justify-center w-full select-none"
    >
      <img src="/logotype.png" width={32} height={32} alt="" className="min-w-10 min-h-10" draggable={false} />
      <div className="hidden md:block w-fit">
        <Typography className="tracking-tight text-2xl font-bold truncate space-grotesk">
          Repliq
        </Typography>
      </div>
    </CustomLink>
  );
};

const NavbarNotifications = reatomComponent<{ size?: number }>(({ ctx, size }) => {
  const hasNewNotifications = ctx.spy(userGlobalOptionsAtom).has_new_notifications;

  return (
    <>
      {hasNewNotifications && (
        <div
          className="absolute w-2 h-2 rounded-lg bg-green-500/80 bottom-2.5 right-2 "
        />
      )}
      <IconBell size={size ?? 22} className="text-shark-300" />
    </>
  )
}, "NavbarNotifications")

export const Navbar = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)
  const pathname = usePageContext().urlParsed.pathname;

  return (
    <div
      id="top-bar"
      className="hidden sm:flex items-center justify-between w-full gap-2"
    >
      <div className="flex md:w-fit h-10 rounded-lg py-1">
        <Logotype />
      </div>
      <div className="flex w-fit md:self-end items-center gap-2">
        {pathname === '/search' ? null : <NavbarSearch />}
        {isAuthenticated && <ActionsLinks />}
        {isAuthenticated && (
          <CustomLink
            to="/notifications"
            className="flex items-center gap-1 rounded-lg justify-center 
              min-w-10 min-h-10 relative hover:bg-shark-900 duration-150 ease-out bg-shark-950"
          >
            <NavbarNotifications />
          </CustomLink>
        )}
        {isAuthenticated ? <UserMenu trigger={<ProfileBadge />} /> : <AuthorizationButton />}
      </div>
    </div>
  )
}, "Navbar")