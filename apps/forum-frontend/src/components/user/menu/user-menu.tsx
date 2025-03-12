import { Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { LogoutModal } from "#components/modals/action-confirmation/components/logout/components/logout-modal.tsx";
import { userGlobalOptionsQuery } from "@repo/lib/queries/user-global-options-query.ts";
import { UserSettingsModal } from "#components/modals/user-settings/components/user-settings-modal";
import { CircleUserRound, SlidersVertical, UsersRound } from "lucide-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { USER_URL } from "@repo/shared/constants/routes";
import { TicketCheck, ShoppingBasket, Shield, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { Dialog, DialogTrigger } from "@repo/ui/src/components/dialog";
import { userSettingsQuery } from "#components/modals/user-settings/queries/user-settings-query";
import { useUserSettingsModal } from "#components/modals/user-settings/hooks/use-user-settings-modal";
import { ReactNode } from "react";
import { UserBalance } from "../balance/user-balance";

const COLLECTION_LINKS: { icon: any, name: string, query: "purchases" | "tickets" }[] = [
  { icon: ShoppingBasket, name: "Мои покупки", query: "purchases" },
  { icon: TicketCheck, name: "Мои тикеты", query: "tickets" }
];

const AdminButton = () => {
  const { data } = userGlobalOptionsQuery();

  if (!data || !data?.is_admin) return null;

  return (
    <>
      <Link to="/admin">
        <DropdownMenuItem className="gap-2 group cursor-pointer" >
          <Shield size={20} className="text-shark-300" />
          <Typography textSize="medium">
            Панель админа
          </Typography>
        </DropdownMenuItem>
      </Link>
      <Separator />
    </>
  );
};

type UserMenuProps = {
  trigger: ReactNode
}

export const UserMenu = ({
  trigger
}: UserMenuProps) => {
  const { nickname } = getUser();
  const { global } = userSettingsQuery().data
  const { toggleGlobalDialogMutation } = useUserSettingsModal()

  return (
    <Dialog
      open={global}
      onOpenChange={value => toggleGlobalDialogMutation.mutate({ reset: true, value })}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full lg:w-fit group focus-visible:outline-none">
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="min-w-[240px]">
          <div className="flex flex-col gap-y-2 w-full">
            <div className="flex flex-col gap-2 w-full p-2">
              <UserBalance />
            </div>
            <Separator />
            <Link to={USER_URL + nickname}>
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <CircleUserRound size={20} className="icon-color" />
                <Typography textSize="medium">
                  Мой профиль
                </Typography>
              </DropdownMenuItem>
            </Link>
            {COLLECTION_LINKS.map(({ icon: Icon, name, query }) => (
              <Link key={name} to="/collection" search={{ type: query }}>
                <DropdownMenuItem className="gap-2 group cursor-pointer" >
                  <Icon size={20} className="text-shark-300" />
                  <Typography textSize="medium">
                    {name}
                  </Typography>
                </DropdownMenuItem>
              </Link>
            ))}
            <Link to="/friends">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <UsersRound size={20} className="icon-color" />
                <Typography textSize="medium">
                  Друзья
                </Typography>
              </DropdownMenuItem>
            </Link>
            <Link to="/notifications">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <CircleUserRound size={20} className="icon-color" />
                <Typography textSize="medium">
                  Уведомления
                </Typography>
              </DropdownMenuItem>
            </Link>
            <Separator />
            <AdminButton />
            <DropdownMenuItem asChild>
              <DialogTrigger className="flex items-center w-full gap-2 group cursor-pointer">
                <SlidersVertical size={20} className="text-shark-300" />
                <Typography textSize="medium">Настройки</Typography>
              </DialogTrigger>
            </DropdownMenuItem>
            <Separator />
            <LogoutModal
              trigger={
                <div className="flex hover:bg-shark-600 rounded-md px-2 py-1.5 gap-2 group cursor-pointer" >
                  <LogOut size={20} className="text-red-500" />
                  <Typography className="text-red-500" textSize="medium">
                    Выйти из аккаунта
                  </Typography>
                </div>
              }
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserSettingsModal />
    </Dialog>
  );
};