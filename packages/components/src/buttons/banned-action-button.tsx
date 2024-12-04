"use client";

import { Button } from "@repo/ui/src/components/button.tsx";
import { useLogout } from "../modals/action-confirmation/components/logout/hooks/use-logout.ts";

export const BannedActionButton = () => {
  const { logoutMutation } = useLogout();

  return (
    <Button
      rounded="none"
      variant="minecraft"
      state="default"
      disabled={logoutMutation.isPending || logoutMutation.isSuccess}
      pending={logoutMutation.isPending || logoutMutation.isError}
      onClick={() => logoutMutation.mutate()}
    >
      Выйти из аккаунта
    </Button>
  );
};
