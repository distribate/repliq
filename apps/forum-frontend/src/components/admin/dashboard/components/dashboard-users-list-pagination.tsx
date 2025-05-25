import { useNavigate, useLocation, getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { Button } from "@repo/ui/src/components/button.tsx";

type DashboardUsersListPaginationProps = {
  length: number | null;
};

const dashboardRoute = getRouteApi("/_protected/_admin/admin/dashboard")

export const DashboardUsersListPagination = ({
  length
}: DashboardUsersListPaginationProps) => {
  const searchParams = dashboardRoute.useSearch();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!length) return;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const buttonsLength = Math.floor(length / 6) + 1;

  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: buttonsLength }).map((_, i) => (
        <Button
          key={i}
          // onClick={() =>
          //   navigate({
          //     to:
          //       pathname + "?" + createQueryString(USERS_QUERY_KEY, i.toString()),
          //   })
          // }
          state="default"
          className="flex items-center justify-center p-1 hover:brightness-75 w-8 h-8"
        >
          <span className="font-semibold">{i}</span>
        </Button>
      ))}
    </div>
  );
};
