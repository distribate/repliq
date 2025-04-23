import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx";
import { useNavigate, useLocation, getRouteApi } from "@tanstack/react-router";

type SearchNavigationBadgeProps = {
  title: string;
  paramValue: "threads" | "saved_threads" | "referals" | "purchases" | "tickets" | "all";
};

const searchRoute = getRouteApi("/_protected/search")

export const SearchNavigationBadge = ({
  title, paramValue,
}: SearchNavigationBadgeProps) => {
  const { pathname } = useLocation();
  const searchParams = searchRoute.useSearch();
  const navigate = useNavigate();

  const handleSection = () => {
    if (paramValue === "all") {
      return navigate({ to: pathname });
    }

    navigate({ to: pathname, search: { type: paramValue }});
  };

  const isActive = (): boolean => {
    if (paramValue === "all" && !searchParams.type) {
      return true;
    }

    return paramValue === searchParams.type
  };

  return <NavigationBadge onClick={handleSection} title={title} data-state={isActive() ? "active" : "inactive"} />
};