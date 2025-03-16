import { useNavigate, useSearch } from "@tanstack/react-router";
import { NavigationBadge } from "#components/navigation/components/navigation-badge";

export type AdminSections = "reports" | "tickets" | "stats"

const SECTION_QUERY_KEY = "section";

type AdminNavigationBadgeProps = {
  title: string;
  paramValue: AdminSections | null;
};

export const AdminNavigationBadge = ({
  title, paramValue,
}: AdminNavigationBadgeProps) => {
  const searchParams = useSearch({ from: "/_protected/_admin" });
  const navigate = useNavigate();

  const handleSection = () => {
    if (!paramValue) {
      return navigate({ to: ".", search: { section: undefined } });
    }

    navigate({ to: ".", search: { section: paramValue } });
  };

  const isActive = (): "active" | "inactive" => {
    if (!paramValue && !searchParams[SECTION_QUERY_KEY]) {
      return "active"
    }

    return paramValue === searchParams[SECTION_QUERY_KEY] ? "active" : "inactive"
  };

  return <NavigationBadge onClick={handleSection} data-state={isActive()} title={title} />
};