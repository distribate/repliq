"use client";

import { NavigationBadge } from "#navigation/components/navigation-badge.tsx";
import { useSearch, useNavigate, useLocation } from "@tanstack/react-router";
import { SearchType } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";

const SEARCH_TYPE_QUERY_KEY = "type";

type SearchNavigationBadgeProps = {
  title: string;
  paramValue: SearchType;
};

export const SearchNavigationBadge = ({
  title,
  paramValue,
}: SearchNavigationBadgeProps) => {
  const {pathname} = useLocation();
  const searchParams = useSearch({
    from: "/_protected/search",
  });
  
  const navigate = useNavigate();

  const createQueryString = () => {
    const query = new URLSearchParams(searchParams);
    query.set(SEARCH_TYPE_QUERY_KEY, paramValue);
    return query.toString();
  };

  const handleSection = () => {
    const url = pathname + "?";

    if (paramValue === "all") {
      return navigate({ to: pathname });
    }

    navigate({ to: url + createQueryString() });
  };

  const isActive = (): boolean => {
    if (paramValue === "all" && !searchParams[SEARCH_TYPE_QUERY_KEY]) {
      return true;
    }

    return paramValue === searchParams[SEARCH_TYPE_QUERY_KEY]
  };

  return (
    <NavigationBadge
      onClick={handleSection}
      title={title}
      isActive={isActive()}
    />
  );
};
