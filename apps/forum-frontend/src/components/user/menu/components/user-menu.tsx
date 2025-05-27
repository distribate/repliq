import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { CircleUserRound, SlidersVertical, UsersRound } from "lucide-react";
import { getUser, userGlobalOptionsAtom } from "@repo/lib/helpers/get-user";
import { USER_URL } from "@repo/shared/constants/routes";
import { TicketCheck, ShoppingBasket, Shield, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { toggleGlobalDialogAction } from "#components/modals/user-settings/models/update-user-settings.model";
import { lazy, ReactNode, Suspense } from "react";
import { UserBalance } from "../../balance/components/user-balance";
import { reatomComponent } from "@reatom/npm-react";
import { logoutModalIsOpenAtom } from "#components/modals/action-confirmation/components/logout/models/logout.model";
import { CustomLink } from "#components/shared/link";

const SettingsModal = lazy(() => import("#components/modals/user-settings/components/user-settings-modal").then(m => ({ default: m.UserSettingsModal })))
const LogoutModal = lazy(() => import("#components/modals/action-confirmation/components/logout/components/logout-modal.tsx").then(m => ({ default: m.LogoutModal })))

const COLLECTION_LINKS: { icon: any, name: string, query: "purchases" | "tickets" }[] = [
  { icon: ShoppingBasket, name: "Мои покупки", query: "purchases" },
  { icon: TicketCheck, name: "Мои тикеты", query: "tickets" }
];

const Admin = reatomComponent(({ ctx }) => {
  const is_admin = ctx.spy(userGlobalOptionsAtom).is_admin

  if (!is_admin) return null;

  return (
    <>
      <CustomLink to="/admin">
        <DropdownMenuItem className="gap-2 group cursor-pointer" >
          <Shield size={20} className="text-shark-300" />
          <Typography textSize="medium">
            Панель админа
          </Typography>
        </DropdownMenuItem>
      </CustomLink>
      <Separator />
    </>
  );
}, "Admin")

const Profile = reatomComponent(({ ctx }) => {
  const nickname = getUser(ctx).nickname;

  return (
    <CustomLink to={USER_URL + nickname}>
      <DropdownMenuItem className="gap-2 group cursor-pointer" >
        <CircleUserRound size={20} className="icon-color" />
        <Typography textSize="medium">
          Мой профиль
        </Typography>
      </DropdownMenuItem>
    </CustomLink>
  )
})

const Settings = reatomComponent(({ ctx }) => {
  return (
    <DropdownMenuItem
      onSelect={() => {
        requestAnimationFrame(() => toggleGlobalDialogAction(ctx, { reset: true, value: true }));
      }}
      className="gap-2 group cursor-pointer"
    >
      <SlidersVertical size={20} className="text-shark-300" />
      <Typography textSize="medium">Настройки</Typography>
    </DropdownMenuItem >
  )
})

const Logout = reatomComponent(({ ctx }) => {
  return (
    <DropdownMenuItem
      onSelect={() => {
        requestAnimationFrame(() => logoutModalIsOpenAtom(ctx, true));
      }}
      className="gap-2 group cursor-pointer"
    >
      <LogOut size={20} className="text-red-500" />
      <Typography className="text-red-500" textSize="medium">
        Выйти из аккаунта
      </Typography>
    </DropdownMenuItem>
  )
})

export const UserMenu = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <>
      <Suspense>
        <SettingsModal />
      </Suspense>
      <Suspense>
        <LogoutModal />
      </Suspense>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger className="w-full lg:w-fit group focus-visible:outline-none">
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="min-w-[240px]">
          <div className="flex flex-col gap-y-2 w-full">
            <div className="flex flex-col gap-2 w-full p-2">
              <UserBalance />
            </div>
            <Separator />
            <Profile />
            {COLLECTION_LINKS.map(({ icon: Icon, name, query }) => (
              <CustomLink key={name} to="/collection" search={{ type: query }}>
                <DropdownMenuItem className="gap-2 group cursor-pointer" >
                  <Icon size={20} className="text-shark-300" />
                  <Typography textSize="medium">
                    {name}
                  </Typography>
                </DropdownMenuItem>
              </CustomLink>
            ))}
            <CustomLink to="/friends">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <UsersRound size={20} className="icon-color" />
                <Typography textSize="medium">
                  Друзья
                </Typography>
              </DropdownMenuItem>
            </CustomLink>
            <CustomLink to="/notifications">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <CircleUserRound size={20} className="icon-color" />
                <Typography textSize="medium">
                  Уведомления
                </Typography>
              </DropdownMenuItem>
            </CustomLink>
            <Separator />
            <Admin />
            <Settings />
            <Separator />
            <Logout />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}