import { Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { LogoutModal } from "#modals/action-confirmation/components/logout/components/logout-modal.tsx";
import { userGlobalOptionsQuery } from "@repo/lib/queries/user-global-options-query.ts";
import { Suspense, lazy } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";

const UserSettingsModal = lazy(() => import("#modals/user-settings/user-settings-modal.tsx")
  .then(m => ({ default: m.UserSettingsModal }))
)

const COLLECTION_LINKS = [
  { name: "Мои темы", query: "threads" },
  { name: "Сохранненое", query: "saved" },
];

const AdminButton = () => {
  const { data } = userGlobalOptionsQuery();

  if (!data || !data?.is_admin) return null;

  return (
    <>
      <Link to="/admin">
        <DropdownMenuItem>
          <Typography>
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
          <DropdownMenuItem>
            <Typography>{collection.name}</Typography>
          </DropdownMenuItem>
        </Link>
      ))}
      <Separator />
      <Suspense fallback={<Skeleton className="h-8 w-full" />}>
        <UserSettingsModal />
      </Suspense>
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