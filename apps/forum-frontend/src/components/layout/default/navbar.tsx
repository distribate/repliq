import { Avatar } from "#components/user/avatar/components/avatar";
import { UserMenu } from "#components/user/menu/user-menu";
import { Typography } from "@repo/ui/src/components/typography";
import { Compass, Plus, Pencil, Pickaxe, NotebookPen, Axe, Cuboid, UsersRound, Rocket } from "lucide-react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { currentUserQuery } from "@repo/lib/queries/current-user-query";
import { globalOptionQuery } from "@repo/lib/queries/global-option-query";
import { Button } from "@repo/ui/src/components/button";
import LogotypeImage from "@repo/assets/images/logotype.png";
import { Suspense } from "react";
import { HoverCard, HoverCardContent, HoverCardItem, HoverCardTrigger } from "@repo/ui/src/components/hover-card";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"

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

const ProfileBadge = () => {
  const nickname = currentUserQuery().data.nickname

  return (
    <div className="flex items-center justify-between h-12 px-2 py-1 gap-3 bg-shark-950 rounded-lg">
      <Suspense fallback={<Skeleton className="w-[32px] h-[32px]" />}>
        <Avatar propHeight={32} propWidth={32} nickname={nickname} />
      </Suspense>
      <MenuArrow />
    </div>
  )
}

const Logotype = () => {
  return (
    <Link to="/" className="flex items-center justify-center w-full select-none">
      <img src={LogotypeImage} width={32} height={32} alt="" draggable={false} />
      <div className="w-fit ml-2">
        <Typography textSize="very_big" textColor="shark_white" font="minecraft" className="truncate">
          Fasberry
        </Typography>
      </div>
    </Link>
  );
};

export const Navbar = () => {
  const { isAuthenticated } = globalOptionQuery().data
  const navigate = useNavigate()
  const pathname = useLocation({ select: l => l.pathname })

  const isActive = (links: Array<string>): "selected" | "unselected" =>
    links.map(i => i.split("?")[0]).includes(pathname) ? "selected" : "unselected"

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-2">
      <div className="flex w-full lg:w-fit h-12 rounded-lg py-1">
        <Logotype />
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full lg:w-fit rounded-lg">
        {_NAVBAR.map(({ childs, icon: Icon, title }) => (
          <HoverCard openDelay={1} closeDelay={2}>
            <HoverCardTrigger
              data-sel={isActive(childs.map(i => i.link))}
              className="flex items-center h-12 gap-3 select-none duration-150 ease-in pr-2 rounded-lg group cursor-pointer 
                data-[sel=selected]:bg-biloba-flower-800/60 bg-shark-950 lg:bg-transparent justify-between data-[state=open]:bg-shark-950"
            >
              <div className="flex items-center gap-3 px-3 lg:px-6">
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
                  <Link key={title} to={link}>
                    <HoverCardItem className="gap-3 px-4 py-2 group cursor-pointer">
                      <Icon size={20} className="text-shark-300" />
                      <Typography textSize="medium">{title}</Typography>
                    </HoverCardItem>
                  </Link>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      <div className="flex w-full lg:w-fit lg:self-end items-center gap-2">
        <HoverCard openDelay={1}>
          <HoverCardTrigger
            className="flex items-center rounded-lg justify-center h-12 w-12 bg-shark-950 group"
          >
            <Plus size={24} className="text-shark-300" />
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="end">
            <div className="flex flex-col gap-2 w-full h-full">
              {CREATE.map(({ icon: Icon, title, link }) => (
                <Link key={title} to={link}>
                  <HoverCardItem className="gap-2 pr-6 py-2 w-full cursor-pointer">
                    <Icon size={20} className="text-shark-300" />
                    <Typography textSize="medium">{title}</Typography>
                  </HoverCardItem>
                </Link>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
        {isAuthenticated ? <UserMenu trigger={<ProfileBadge />} /> : (
          <Button onClick={() => navigate({ to: "/auth" })} className="flex items-center rounded-lg bg-shark-50 h-12 px-6">
            <Typography textSize="large" className="text-shark-900 font-semibold">
              Авторизоваться
            </Typography>
          </Button>
        )}
      </div>
    </div>
  )
}