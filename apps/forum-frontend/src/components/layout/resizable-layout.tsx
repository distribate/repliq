import { Avatar } from "#components/user/avatar/components/avatar";
import { SidebarLogotype } from "#components/sidebar/desktop/components/sidebar-content/logotype/sidebar-logotype";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { UserMenu } from "#components/sidebar/desktop/components/sidebar-content/user-menu/user-menu";
import { ArrowDown } from "lucide-react";
import { UserBalance } from "#components/user/balance/user-balance";
import { Typography } from "@repo/ui/src/components/typography";
import { Compass, Plus, Pencil, NotebookPen } from "lucide-react"
import { Link } from "@tanstack/react-router";
import { Axe, Cuboid, UsersRound, Rocket } from "lucide-react";
import { currentUserQuery } from "@repo/lib/queries/current-user-query";

const ProfileBadge = () => {
  const { nickname } = currentUserQuery().data

  return (
    <div className="flex items-center justify-between h-14 px-2 py-1 gap-3 bg-shark-950 rounded-lg">
      <Avatar propHeight={36} propWidth={36} nickname={nickname} />
      <UserBalance />
      <DropdownArrow/>
    </div>
  )
}

const DISCOVER = [
  { icon: UsersRound, title: "Игроки", link: "/search?type=users" },
  { icon: Rocket, title: "Рейтинг", link: "/ratings" },
  { icon: Cuboid, title: "Территории", link: "/lands" },
  { icon: UsersRound, title: "Треды", link: "/search?type=threads" },
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

const DropdownArrow = () => {
  return (
    <ArrowDown
      size={20}
      className="transition-all duration-150 ease-in 
      group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180 text-shark-300"
    />
  )
}

export const Navbar = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-2">
      <div className="flex w-full lg:w-fit bg-shark-950 h-14 rounded-lg px-6 py-1">
        <SidebarLogotype />
      </div>
      <div className="flex gap-2 w-full lg:w-fit rounded-lg *:w-full">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-14 gap-3 rounded-lg items-center group px-6 bg-shark-950/80 hover:bg-shark-950 focus-visible:outline-none"
          >
            <Compass size={20} className="text-shark-300" />
            <Typography className="font-semibold text-lg">
              Исследовать
            </Typography>
            <DropdownArrow />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <div className="flex flex-col gap-2 w-full h-full">
              {DISCOVER.map(({ icon: Icon, title, link }, idx) => (
                <Link key={idx} to={link}>
                  <DropdownMenuItem className="gap-2 px-4 py-2 group cursor-pointer">
                    <Icon size={20} className="text-shark-300" />
                    <Typography className="text-[18px]">
                      {title}
                    </Typography>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-14 gap-3 rounded-lg items-center group px-6 bg-shark-950/80 hover:bg-shark-950 focus-visible:outline-none"
          >
            <Compass size={20} className="text-shark-300" />
            <Typography className="font-semibold text-lg">
              Ресурсы
            </Typography>
            <DropdownArrow />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            {RESOURCES.map(({ icon: Icon, title, link }, idx) => (
              <a key={idx} href={link}>
                <DropdownMenuItem className="gap-2 px-4 py-2 group cursor-pointer">
                  <Icon size={20} className="text-shark-300" />
                  <Typography className="text-[18px]">
                    {title}
                  </Typography>
                </DropdownMenuItem>
              </a>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex self-end items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center rounded-lg justify-center h-14 w-14 bg-shark-950 group focus-visible:outline-none"
          >
            <Plus size={24} className="text-shark-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <div className="flex flex-col gap-2 w-full h-full">
              {CREATE.map(({ icon: Icon, title, link }, idx) => (
                <Link key={idx} to={link}>
                  <DropdownMenuItem className="gap-2 px-4 py-2 w-full">
                    <Icon size={20} className="text-shark-300" />
                    <Typography className="text-[16px]">
                      {title}
                    </Typography>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="group focus-visible:outline-none">
            <ProfileBadge />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <UserMenu />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}