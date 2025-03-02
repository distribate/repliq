import { Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { LogoutModal } from "#components/modals/action-confirmation/components/logout/components/logout-modal.tsx";
import { userGlobalOptionsQuery } from "@repo/lib/queries/user-global-options-query.ts";
import { UserSettingsModal } from "#components/modals/user-settings/user-settings-modal.tsx";

const COLLECTION_LINKS = [
  { name: "Мои темы", query: "threads" },
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

export const UserMenu = () => {
  return (
    <div className="flex flex-col gap-y-2 w-[200px]">
      {COLLECTION_LINKS.map((collection) => (
        <Link
          key={collection.name}
          to="/collection"
          search={{ type: collection.query }}
        >
          <DropdownMenuItem className="gap-2 group cursor-pointer">
            <Typography textSize="medium">
              {collection.name}
            </Typography>
          </DropdownMenuItem>
        </Link>
      ))}
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