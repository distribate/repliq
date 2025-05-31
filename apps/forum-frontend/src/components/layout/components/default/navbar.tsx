import { Avatar } from "#components/user/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography";
import { Compass, Plus, Pencil, Pickaxe, NotebookPen, Axe, Cuboid, UsersRound, Rocket } from "lucide-react"
import { useLocation } from "@tanstack/react-router";
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query";
import { HoverCard, HoverCardContent, HoverCardItem, HoverCardTrigger } from "@repo/ui/src/components/hover-card";
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { UserMenu } from "#components/user/menu/components/user-menu";
import { CustomLink } from "#components/shared/link";
import { isExperimentalDesignAtom } from "./experimental-layout.model";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import LogotypeImage from "@repo/assets/images/logotype.png"
import { AuthorizationButton } from "./authorization-button";

const DISCOVER = [
  { icon: UsersRound, title: "Игроки", link: "/search?type=users" },
  { icon: Rocket, title: "Рейтинг", link: "/ratings" },
  { icon: Cuboid, title: "Территории", link: "/lands" },
  { icon: Axe, title: "Ивенты", link: "/events" }
]

const RESOURCES = [
  { icon: Axe, title: "Справочник", link: "https://fasberry.su/wiki" },
  { icon: NotebookPen, title: "Карта мира", link: "https://map.fasberry.su" }
]

const CREATE = [
  { icon: Pencil, title: "Создать тред", link: "/create-thread" },
  { icon: NotebookPen, title: "Открыть тикет", link: "/create-ticket" }
]

const _NAVBAR = [
  { title: "Исследовать", icon: { value: Compass, size: 20 }, childs: DISCOVER },
  { title: "Ресурсы", icon: { size: 20, value: Pickaxe }, childs: RESOURCES }
]

const ProfileBadge = reatomComponent(({ ctx }) => {
  const nickname = getUser(ctx).nickname

  return (
    <div className="flex items-center justify-between h-10 px-2 py-1 gap-3 bg-shark-950 rounded-lg">
      <Avatar propHeight={32} propWidth={32} nickname={nickname} />
      <MenuArrow />
    </div>
  )
}, "ProfileBadge")

const validateActiveLink = (links: string[], pathname: string) => {
  return links
    .map(i => i.split("?")[0])
    .includes(pathname) ? "selected" : "unselected"
}

const MainLinks = reatomComponent(({ ctx }) => {
  const pathname = useLocation({ select: params => params.pathname })

  if (!ctx.spy(isAuthenticatedAtom) || ctx.spy(isExperimentalDesignAtom)) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-fit rounded-lg">
      {_NAVBAR.map(({ childs, icon: Icon, title }, idx) => (
        <HoverCard key={idx} openDelay={1} closeDelay={2}>
          <HoverCardTrigger
            data-status={validateActiveLink(childs.map(i => i.link), pathname)}
            className="flex items-center h-10 gap-1 select-none duration-150 pr-2 rounded-lg group cursor-pointer 
          data-[status=selected]:bg-biloba-flower-800/60 bg-shark-950 md:bg-transparent justify-between data-[state=open]:bg-shark-950"
          >
            <div className="flex items-center gap-2 px-4">
              <Icon.value
                size={Icon.size}
                className="group-data-[sel=selected]:text-biloba-flower-500 
              group-data-[sel=selected]:brightness-125 group-data-[sel=unselected]:text-shark-300"
              />
              {title && <Typography className="font-semibold text-base">{title}</Typography>}
            </div>
            <MenuArrow />
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="end">
            <div className="flex flex-col gap-2 w-full h-full">
              {childs.map(({ icon: Icon, title, link }) => (
                <CustomLink key={title} to={link}>
                  <HoverCardItem className="gap-3 px-4 py-2 group cursor-pointer">
                    <Icon size={20} className="text-shark-300" />
                    <Typography textSize="medium">{title}</Typography>
                  </HoverCardItem>
                </CustomLink>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
})

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

const Logotype = () => {
  return (
    <CustomLink to="/" className="flex items-center justify-center w-full select-none">
      <img src={LogotypeImage} width={26} height={26} alt="" draggable={false} />
      <div className="w-fit ml-1">
        <Typography textSize="big" textColor="shark_white" font="minecraft" className="font-medium leading-7 truncate">
          Fasberry
        </Typography>
      </div>
    </CustomLink>
  );
};

export const Navbar = () => {
  return (
    <div id="top-bar" className="hidden md:flex flex-col md:flex-row items-center justify-between w-full gap-2">
      <div className="flex w-full md:w-fit h-10 rounded-lg py-1">
        <Logotype />
      </div>
      <MainLinks />
      <div className="flex w-full md:w-fit md:self-end items-center gap-2">
        <ActionsLinks />
        <NavbarUserMenu />
      </div>
    </div>
  )
}