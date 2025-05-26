import { Avatar } from "#components/user/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography";
import { Compass, Plus, Pencil, Pickaxe, NotebookPen, Axe, Cuboid, UsersRound, Rocket } from "lucide-react"
import { useLocation, useNavigate } from "@tanstack/react-router";
import { globalOptionsAtom } from "@repo/lib/queries/global-option-query";
import { Button } from "@repo/ui/src/components/button";
import LogotypeImage from "@repo/assets/images/logotype.png";
import { HoverCard, HoverCardContent, HoverCardItem, HoverCardTrigger } from "@repo/ui/src/components/hover-card";
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { UserMenu } from "#components/user/menu/components/user-menu";
import { CustomLink } from "#components/shared/link";

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

type NavbarType = {
  title?: string,
  icon: { value: any, size: number },
  childs: typeof DISCOVER
}

const _NAVBAR: NavbarType[] = [
  {
    title: "Исследовать",
    icon: { value: Compass, size: 20 },
    childs: DISCOVER
  },
  {
    title: "Ресурсы",
    icon: { size: 20, value: Pickaxe },
    childs: RESOURCES
  }
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

export const AuthorizationButton = () => {
  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate({ to: "/auth" })} className="flex items-center rounded-lg bg-shark-50 h-10 px-6">
      <Typography textSize="large" className="text-shark-900 font-semibold">
        Авторизоваться
      </Typography>
    </Button>
  )
}

export const Navbar = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(globalOptionsAtom).isAuthenticated
  const pathname = useLocation({ select: params => params.pathname })

  const isActive = (links: Array<string>): "selected" | "unselected" =>
    links.map(i => i.split("?")[0]).includes(pathname) ? "selected" : "unselected"

  return (
    <div id="top-bar" className="hidden md:flex flex-col md:flex-row items-center justify-between w-full gap-2">
      <div className="flex w-full md:w-fit h-10 rounded-lg py-1">
        <Logotype />
      </div>
      {isAuthenticated && (
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-fit rounded-lg">
          {_NAVBAR.map(({ childs, icon: Icon, title }, idx) => (
            <HoverCard key={idx} openDelay={1} closeDelay={2}>
              <HoverCardTrigger
                data-sel={isActive(childs.map(i => i.link))}
                className="flex items-center h-10 gap-3 select-none duration-150 ease-in pr-2 rounded-lg group cursor-pointer 
              data-[sel=selected]:bg-biloba-flower-800/60 bg-shark-950 md:bg-transparent justify-between data-[state=open]:bg-shark-950"
              >
                <div className="flex items-center gap-3 px-3 md:px-6">
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
      )}
      <div className="flex w-full md:w-fit md:self-end items-center gap-2">
        {isAuthenticated && (
          <HoverCard openDelay={1}>
            <HoverCardTrigger
              className="flex items-center rounded-lg justify-center h-10 w-10 bg-shark-950 group"
            >
              <Plus size={24} className="text-shark-300" />
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="end">
              <div className="flex flex-col gap-2 w-full h-full">
                {CREATE.map(({ icon: Icon, title, link }) => (
                  <CustomLink key={title} to={link}>
                    <HoverCardItem className="gap-2 pr-6 py-2 w-full cursor-pointer">
                      <Icon size={20} className="text-shark-300" />
                      <Typography textSize="medium">{title}</Typography>
                    </HoverCardItem>
                  </CustomLink>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
        {isAuthenticated ? (
          <UserMenu trigger={<ProfileBadge />} />
        ) : (
          <AuthorizationButton/>
        )}
      </div>
    </div>
  )
}, "Navbar")