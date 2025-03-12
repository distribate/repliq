import { Avatar } from "#components/user/avatar/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { UserMenu } from "#components/user/menu/user-menu";
import { ArrowDown } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { Compass, Plus, Pencil, Pickaxe, NotebookPen, Axe, Cuboid, UsersRound, Rocket } from "lucide-react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { currentUserQuery } from "@repo/lib/queries/current-user-query";
import { globalOptionQuery } from "@repo/lib/queries/global-option-query";
import { Button } from "@repo/ui/src/components/button";
import LogotypeImage from "@repo/assets/images/logotype.png";
import { Suspense } from "react";
import { HoverCard, HoverCardContent, HoverCardItem, HoverCardTrigger } from "@repo/ui/src/components/hover-card";

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

const ProfileBadge = () => {
  const { nickname } = currentUserQuery().data

  return (
    <div className="flex w-full items-center justify-between h-12 px-2 py-1 gap-3 bg-shark-950 rounded-lg">
      <div className="flex items-center gap-3">
        <Suspense>
          <Avatar propHeight={32} propWidth={32} nickname={nickname} />
        </Suspense>
      </div>
      <DropdownArrow />
    </div>
  )
}

export const DropdownArrow = () => {
  return (
    <ArrowDown
      size={20}
      className="transition-all duration-150 ease-in 
      group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180 text-shark-300"
    />
  )
}

const Logotype = () => {
  return (
    <Link
      title="Главная"
      to="/"
      className="flex active:scale-[1.04] backdrop-blur-md rounded-lg items-center justify-center w-full select-none"
    >
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
  const { isAuthenticated: isAuth } = globalOptionQuery().data
  const navigate = useNavigate()
  const pathname = useLocation({
    select: l => l.pathname
  })

  const isActive = (links: Array<string>): boolean => links.map(i => i.split("?")[0]).includes(pathname)

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-2">
      <div className="flex w-full lg:w-fit h-12 rounded-lg px-6 py-1">
        <Logotype />
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full lg:w-fit rounded-lg">
        <HoverCard openDelay={1}>
          <HoverCardTrigger
            className={`flex h-12 gap-3 select-none duration-150 ease-in rounded-lg items-center group px-6 cursor-pointer 
              ${isActive(DISCOVER.map(i => i.link)) ? "bg-biloba-flower-800/60" : "data-[state=open]:bg-shark-950"}`}
          >
            <Compass
              size={20}
              className={isActive(DISCOVER.map(i => i.link)) ? "text-biloba-flower-500 brightness-125" : "text-shark-300"}
            />
            <Typography className="font-semibold text-base">
              Исследовать
            </Typography>
            <DropdownArrow />
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="end">
            <div className="flex flex-col gap-2 w-full h-full">
              {DISCOVER.map(({ icon: Icon, title, link }, idx) => (
                <Link key={idx} to={link}>
                  <HoverCardItem className="gap-3 px-4 py-2 group cursor-pointer">
                    <Icon size={20} className="text-shark-300" />
                    <Typography textSize="medium">
                      {title}
                    </Typography>
                  </HoverCardItem>
                </Link>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={1}>
          <HoverCardTrigger
            className="flex h-12 gap-3 select-none duration-150 ease-in rounded-lg items-center group px-6 
              cursor-pointer data-[state=open]:bg-shark-950"
          >
            <Pickaxe
              size={20}
              className="text-shark-300"
            />
            <Typography className="font-semibold text-base">
              Ресурсы
            </Typography>
            <DropdownArrow />
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="end">
            {RESOURCES.map(({ icon: Icon, title, link }, idx) => (
              <a key={idx} href={link}>
                <HoverCardItem className="gap-2 pr-6 py-2 group cursor-pointer">
                  <Icon size={20} className="text-shark-300" />
                  <Typography textSize="medium">
                    {title}
                  </Typography>
                </HoverCardItem>
              </a>
            ))}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex w-full lg:w-fit lg:self-end items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center rounded-lg justify-center h-12 w-12 
              bg-shark-950 group focus-visible:outline-none"
          >
            <Plus size={24} className="text-shark-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="min-w-[200px]">
            <div className="flex flex-col gap-2 w-full h-full">
              {CREATE.map(({ icon: Icon, title, link }, idx) => (
                <Link key={idx} to={link}>
                  <DropdownMenuItem className="gap-2 pr-6 py-2 w-full">
                    <Icon size={20} className="text-shark-300" />
                    <Typography textSize="medium">
                      {title}
                    </Typography>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {isAuth ? (
          <UserMenu trigger={<ProfileBadge />} />
        ) : (
          <Button onClick={() => navigate({ to: "/auth" })} className="flex items-center rounded-lg bg-shark-50 h-14 px-6">
            <Typography textSize="large" className="text-shark-900 font-semibold">
              Авторизоваться
            </Typography>
          </Button>
        )}
      </div>
    </div>
  )
}