import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UsersRound } from "lucide-react";
import { Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { ReactNode } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";
import { toggleGlobalDialogAction } from "#components/modals/user-settings/models/user-settings.model";
import { createIdLink } from "@repo/lib/utils/create-link";
import { IconLayoutDashboard, IconLibrary, IconSettings, IconUserSquare } from "@tabler/icons-react";
import { getUser, userGlobalOptionsAtom } from "#components/user/models/current-user.model";
import { clientOnly } from "vike-react/clientOnly";

const SettingsModal = clientOnly(
  async () => (await import("#components/modals/user-settings/components/user-settings-modal")).UserSettingsModal
)
const LogoutModal = clientOnly(
  async () => (await import("#components/modals/action-confirmation/components/logout/components/logout-modal.tsx")).LogoutModal
)

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
}, "UserMenu.Admin")

const Profile = reatomComponent(({ ctx }) => {
  const nickname = getUser(ctx).nickname;

  return (
    <CustomLink to={createIdLink("user", nickname)}>
      <DropdownMenuItem className="gap-2 group cursor-pointer" >
        <IconUserSquare size={20} className="text-shark-300" />
        <Typography textSize="medium">
          Профиль
        </Typography>
      </DropdownMenuItem>
    </CustomLink>
  )
}, "UserMenu.Profile")

const Settings = reatomComponent(({ ctx }) => {
  const handle = () => {
    requestAnimationFrame(() => toggleGlobalDialogAction(ctx, { reset: true, value: true }));
  }

  return (
    <DropdownMenuItem onSelect={handle} className="gap-2 group cursor-pointer">
      <IconSettings size={20} className="text-shark-300" />
      <Typography textSize="medium">Настройки</Typography>
    </DropdownMenuItem >
  )
}, "UserMenu.Settings")

export const UserMenu = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <>
      <SettingsModal />
      <LogoutModal />
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full lg:w-fit group focus-visible:outline-none">
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="min-w-[240px]">
          <div className="flex flex-col gap-y-2 w-full">
            <Profile />
            <CustomLink to="/collection?type=tickets">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <IconLibrary size={20} className="text-shark-300" />
                <Typography textSize="medium">
                  Тикеты
                </Typography>
              </DropdownMenuItem>
            </CustomLink>
            <CustomLink to="/friends">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <UsersRound size={20} className="text-shark-300" />
                <Typography textSize="medium">
                  Друзья
                </Typography>
              </DropdownMenuItem>
            </CustomLink>
            <CustomLink to="/dashboard">
              <DropdownMenuItem className="gap-2 group cursor-pointer" >
                <IconLayoutDashboard size={20} className="text-shark-300" />
                <Typography textSize="medium">
                  Статистика
                </Typography>
              </DropdownMenuItem>
            </CustomLink>
            <Separator />
            <Admin />
            <Settings />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}