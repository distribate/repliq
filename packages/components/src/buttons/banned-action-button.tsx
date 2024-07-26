'use client';

import { Button } from '@repo/ui/src/components/button.tsx';
import { useLogout } from '../modals/action-confirmation/components/logout/hooks/use-logout.ts';

export const BannedActionButton = () => {
  const { logOut } = useLogout();
  
  const handleLogout = () => {
    logOut.mutate();
  }
  
  return (
    <Button
      rounded="none"
      variant="minecraft"
      state="default"
      disabled={logOut.isPending || logOut.isSuccess}
      pending={logOut.isPending || logOut.isError}
      onClick={handleLogout}
    >
      Выйти из аккаунта
    </Button>
  );
};