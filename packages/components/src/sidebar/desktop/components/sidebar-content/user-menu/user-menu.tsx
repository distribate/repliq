import { Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { LogoutModal } from "#modals/action-confirmation/components/logout/components/logout-modal.tsx";
import { UserSettingsModal } from "#modals/user-settings/user-settings-modal.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { userGlobalOptionsQuery } from "@repo/lib/queries/user-global-options-query.ts";

const COLLECTION_LINKS = [
  { name: "Мои темы", query: "threads" },
  { name: "Сохранненое", query: "saved" },
];

const AdminButton = () => {
  const { data } = userGlobalOptionsQuery();

  if (!data?.is_admin) return null;

  return (
    <>
      <Link to="/admin">
        <DropdownMenuItem>К панели админа</DropdownMenuItem>
      </Link>
      <Separator />
    </>
  );
};

const ProfileLink = () => {
  const currentUser = getUser();

  return (
    <Link to={USER_URL + currentUser.nickname}>
      <DropdownMenuItem>
        <Typography>Перейти к профилю</Typography>
      </DropdownMenuItem>
    </Link>
  );
};

export const UserMenu = () => {
  return (
    <div className="flex flex-col gap-y-2 w-[200px]">
      <ProfileLink />
      <Separator />
      {COLLECTION_LINKS.map((collection) => (
        <Link
          key={collection.name}
          to="/collection"
          search={{ type: collection.query }}
        >
          <DropdownMenuItem>
            <Typography>{collection.name}</Typography>
          </DropdownMenuItem>
        </Link>
      ))}
      <Separator />
      <UserSettingsModal />
      <Separator />
      <AdminButton />
      <LogoutModal
        trigger={
          <HoverCardItem>
            <Typography className="text-red-400">Выйти из аккаунта</Typography>
          </HoverCardItem>
        }
      />
    </div>
  );
};
