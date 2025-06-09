import { useNavigate } from "@tanstack/react-router";
import { NavigationBadge } from "#components/shared/navigation/components/navigation-badge";
import { reatomComponent } from "@reatom/npm-react";
import { adminSectionParamAtom } from "#pages/admin/index.page";

export type AdminSections = "reports" | "tickets" | "stats"

type AdminNavigationBadgeProps = {
  title: string;
  paramValue: AdminSections | null;
};

export const AdminNavigationBadge = reatomComponent<AdminNavigationBadgeProps>(({ ctx, title, paramValue }) => {
  const section = ctx.spy(adminSectionParamAtom)
  const navigate = useNavigate();

  const handleSection = () => {
    if (!paramValue) return navigate({ to: "/admin", search: { section: undefined } });
    navigate({ to: "/admin", search: { section: paramValue }})
  };

  const isActive = (): "active" | "inactive" => {
    if (!paramValue && !section) return "active"
    return paramValue === section ? "active" : "inactive"
  };

  return <NavigationBadge onClick={handleSection} data-state={isActive()} title={title} />
}, "AdminNavigationBadge")