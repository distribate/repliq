import { Avatar } from "#components/user/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography";
import { Plus } from "lucide-react"
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { UserMenu } from "#components/user/menu/components/user-menu";
import { CustomLink } from "#components/shared/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { AuthorizationButton } from "./authorization-button";
import { IconBell, IconBrandThreads, IconHome, IconLibrary, IconMenu2, IconPlus, IconSearch } from "@tabler/icons-react";
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
    <div className="flex items-center justify-between w-fit h-10 px-2 py-1 gap-3 bg-shark-950 rounded-lg">
      <Avatar url={avatar} rounded="medium" propHeight={32} className="min-w-[32px] min-h-[32px]" propWidth={32} nickname={nickname} />
      <MenuArrow />
    </div>
  )
}, "ProfileBadge")

const ActionsLinks = () => {
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
}

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

const NavbarNotifications = reatomComponent<{ size?: number }>(({ ctx, size }) => {
  const hasNewNotifications = ctx.spy(userGlobalOptionsAtom).has_new_notifications;

  return (
    <>
      {hasNewNotifications && <div className="absolute bottom-2.5 right-2 w-2 h-2 rounded-lg bg-green-400/60" />}
      <IconBell size={size ?? 22} className="text-shark-300" />
    </>
  )
}, "NavbarNotifications")

const BOTTOM_LINKS = [
  { title: "Главная", value: "/home", icon: IconHome },
  { title: "Поиск", value: "/search", icon: IconSearch },
  { title: "Создать", value: "/create-thread", icon: IconPlus },
  { title: "Уведомления", value: "/notifications", icon: NavbarNotifications },
  { title: "Меню", value: "/menu", icon: IconMenu2 },
]

export const BottomBar = () => {
  const pathname = usePageContext().urlParsed.pathname;
  const isActive = (t: string) => pathname === t;

  return (
    <div id="bottom-bar" className="sm:hidden fixed bottom-0 z-[50] h-14 w-full bg-primary-color rounded-t-md">
      <div className="flex items-center h-full gap-2 px-4 justify-between w-full">
        {BOTTOM_LINKS.map((link) => (
          <CustomLink
            key={link.value}
            to={link.value}
            aria-current={isActive(link.value) ? "page" : undefined}
            data-state={isActive(link.value) ? "active" : "inactive"}
            className="flex flex-col items-center relative data-[state=active]:text-shark-50 data-[state=inactive]:text-shark-300"
          >
            <link.icon size={26} />
            <span className="sr-only">{link.title}</span>
            <Typography
              aria-label={link.title}
              className="hidden min-[350px]:block text-xs font-semibold text-nowrap truncate"
            >
              {link.title}
            </Typography>
          </CustomLink>
        ))}
      </div>
    </div>
  )
}

export const Navbar = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  return (
    <div id="top-bar" className="hidden sm:flex items-center justify-between w-full gap-2">
      <div className="flex md:w-fit h-10 rounded-lg py-1">
        <Logotype />
      </div>
      <div className="flex w-fit md:self-end items-center gap-2">
        <NavbarSearch />
        {isAuthenticated && <ActionsLinks />}
        {isAuthenticated && (
          <CustomLink
            to="/notifications"
            className="flex items-center gap-1 rounded-lg justify-center min-w-10 min-h-10 relative bg-shark-950"
          >
            <NavbarNotifications />
          </CustomLink>
        )}
        {isAuthenticated ? <UserMenu trigger={<ProfileBadge />} /> : <AuthorizationButton />}
      </div>
    </div>
  )
}, "Navbar")