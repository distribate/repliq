import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx";

export type AdminSections =
  | "reports"
  | "tickets"
  | "main"
  | "stats";

const SECTION_QUERY_KEY = "section";

type AdminNavigationBadgeProps = {
  title: string;
  paramValue: AdminSections;
};

export const AdminNavigationBadge = ({
  title,
  paramValue,
}: AdminNavigationBadgeProps) => {
  const { pathname } = useLocation();
  const searchParams = useSearch({
    from: "/_protected/_admin/admin/",
  });

  const navigate = useNavigate();

  const createQueryString = () => {
    const query = new URLSearchParams(searchParams);
    query.set(SECTION_QUERY_KEY, paramValue);
    return query.toString();
  };

  const handleSection = () => {
    const url = pathname + "?";

    if (paramValue === "main") {
      return navigate({ to: pathname });
    }

    navigate({ to: url + createQueryString() });
  };

  const isActive = (): boolean => {
    if (paramValue === "main" && !searchParams[SECTION_QUERY_KEY]) {
      return true;
    }

    return paramValue === searchParams[SECTION_QUERY_KEY]
  };

  return (
    <NavigationBadge
      onClick={handleSection}
      isActive={isActive()}
      title={title}
    />
  );
};
