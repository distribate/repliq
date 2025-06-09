import { Avatar } from "#components/user/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography";
import { Plus } from "lucide-react"
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query";
import { MenuArrow } from "@repo/ui/src/components/menu-arrow.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { UserMenu } from "#components/user/menu/components/user-menu";
import { CustomLink } from "#components/shared/link";
import { isExperimentalDesignAtom } from "./experimental-layout.model";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import LogotypeImage from "@repo/assets/images/logotype.png"
import { AuthorizationButton } from "./authorization-button";
import { IconBrandThreads, IconLibrary, IconSearch } from "@tabler/icons-react";
import { Input } from "@repo/ui/src/components/input";

const CREATE = [
  { icon: IconBrandThreads, title: "Создать тред", link: "/create-thread" },
  { icon: IconLibrary, title: "Открыть тикет", link: "/create-ticket" }
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
    <CustomLink to="/" className="flex items-center justify-center w-full select-none">
      <img src={LogotypeImage} width={26} height={26} alt="" draggable={false} />
      <div className="w-fit ml-1">
        <Typography textSize="very_big" font="pixy" textColor="shark_white" className="leading-7 truncate">
          Fasberry
        </Typography>
      </div>
    </CustomLink>
  );
};

const NavbarSearch = reatomComponent(({ ctx }) => {
  return (
    <div className="flex justify-start gap-3 items-center bg-shark-950 h-10 rounded-lg px-4">
      <IconSearch size={20} className="text-biloba-flower-300" />
      <Input placeholder="Поиск..." backgroundType="transparent" className="!p-0" />
    </div>
  )
}, "NavbarSearch")

export const Navbar = () => {
  return (
    <div id="top-bar" className="hidden md:flex flex-col md:flex-row items-center justify-between w-full gap-2">
      <div className="flex w-full md:w-fit h-10 rounded-lg py-1">
        <Logotype />
      </div>
      <div className="flex w-full md:w-fit md:self-end items-center gap-2">
        <NavbarSearch />
        <ActionsLinks />
        <NavbarUserMenu />
      </div>
    </div>
  )
}