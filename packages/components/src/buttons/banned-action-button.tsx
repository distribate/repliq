'use client';

import { Button } from '@repo/ui/src/components/button.tsx';
import { useLogout } from '../modals/action-confirmation/components/logout/hooks/use-logout.ts';

export const BannedActionButton = () => {
  const { logOutMutation } = useLogout();
  
  return (
    <Button
      rounded="none"
      variant="minecraft"
      state="default"
      disabled={logOutMutation.isPending || logOutMutation.isSuccess}
      pending={logOutMutation.isPending || logOutMutation.isError}
      onClick={() => logOutMutation.mutate()}
    >
      Выйти из аккаунта
    </Button>
  );
};