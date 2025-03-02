import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx";
import { useNavigate, useLocation, getRouteApi } from "@tanstack/react-router";
import { SearchType } from "#components/sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";

type SearchNavigationBadgeProps = {
  title: string;
  paramValue: SearchType;
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

  return <NavigationBadge onClick={handleSection} title={title} isActive={isActive()} />
};