import { Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { LogoutModal } from "#components/modals/action-confirmation/components/logout/components/logout-modal.tsx";
import { userGlobalOptionsQuery } from "@repo/lib/queries/user-global-options-query.ts";
import { UserSettingsModal } from "#components/modals/user-settings/user-settings-modal.tsx";
import { CircleUserRound, UsersRound } from "lucide-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { USER_URL } from "@repo/shared/constants/routes";

const COLLECTION_LINKS = [
  { name: "Мои покупки", query: "purchases" },
  { name: "Мои тикеты", query: "tickets" }
];

const AdminButton = () => {
  const { data } = userGlobalOptionsQuery();

  if (!data || !data?.is_admin) return null;

  return (
    <>
      <Link to="/admin">
        <DropdownMenuItem className="gap-2 group cursor-pointer">
          <Typography textSize="medium">
            Панель админа
          </Typography>
        </DropdownMenuItem>
      </Link>
      <Separator />
    </>
  );
};

const FriendsLink = () => {
  return (
    <Link to="/friends">
      <DropdownMenuItem className="gap-2 group cursor-pointer">
        <UsersRound size={20} className="icon-color" />
        <Typography className="text-[16px] font-medium">
          Друзья
        </Typography>
      </DropdownMenuItem>
    </Link>
  )
}

const ProfileLink = () => {
  const { nickname } = getUser();

  return (
    <Link to={USER_URL + nickname}>
      <DropdownMenuItem className="gap-2 group cursor-pointer">
        <CircleUserRound size={20} className="icon-color" />
        <Typography className="text-[16px] font-medium">
          Мой профиль
        </Typography>
      </DropdownMenuItem>
    </Link>
  )
}

export const UserMenu = () => {
  return (
    <div className="flex flex-col gap-y-2 w-[200px]">
      <ProfileLink />
      {COLLECTION_LINKS.map((collection) => (
        <Link
          key={collection.name}
          to="/collection"
          // @ts-ignore
          search={{ type: collection.query }}
        >
          <DropdownMenuItem className="gap-2 group cursor-pointer">
            <Typography textSize="medium">
              {collection.name}
            </Typography>
          </DropdownMenuItem>
        </Link>
      ))}
      <FriendsLink/>
      <Separator />
      <AdminButton />
      <UserSettingsModal />
      <Separator />
      <LogoutModal
        trigger={
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 group cursor-pointer">
            <Typography className="text-red-500" textSize="medium">
              Выйти из аккаунта
            </Typography>
          </DropdownMenuItem>
        }
      />
    </div>
  );
};