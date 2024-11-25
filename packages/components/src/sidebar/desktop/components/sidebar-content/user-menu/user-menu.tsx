import Link from 'next/link';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { LogoutModal } from '#modals/action-confirmation/components/logout/components/logout-modal.tsx';
import { UserSettingsModal } from '#modals/user-settings/user-settings-modal.tsx';
import { useEffect, useState } from 'react';
import { checkAdminPermission } from '@repo/lib/actions/check-admin-permission.ts';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

const COLLECTION_LINKS = [
  { name: 'Мои темы', query: 'threads' },
  { name: 'Мои сообщения', query: 'messages' },
  { name: 'Сохранненое', query: 'saved' },
];

const AdminButton = () => {
  const [ isAdmin, setIsAdmin ] = useState<boolean>();
  
  useEffect(() => {
    checkAdminPermission()
    .then(result => setIsAdmin(result));
  }, []);
  
  if (!isAdmin) return null;
  
  return (
    <>
      <Link href={{ pathname: '/admin' }}>
        <DropdownMenuItem>
          К панели админа
        </DropdownMenuItem>
      </Link>
      <Separator />
    </>
  );
};

export const UserMenu = () => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  return (
    <div className="flex flex-col gap-y-2 w-[200px]">
      <Link href={USER_URL + currentUser.nickname}>
        <DropdownMenuItem>
          Перейти к профилю
        </DropdownMenuItem>
      </Link>
      <Separator />
      {COLLECTION_LINKS.map(collection => (
        <Link
          key={collection.name}
          href={{
            pathname: '/collection',
            query: { type: collection.query, },
          }}
        >
          <DropdownMenuItem>
            {collection.name}
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
            <Typography className="text-red-400">
              Выйти из аккаунта
            </Typography>
          </HoverCardItem>
        }
      />
    </div>
  );
};