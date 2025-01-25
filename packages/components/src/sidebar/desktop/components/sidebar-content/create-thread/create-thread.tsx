import { Pencil } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useSidebarControl } from "../../sidebar-layout/hooks/use-sidebar-control.ts";
import { CREATE_THREAD_URL } from "@repo/shared/constants/routes.ts";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { SidebarButton } from "../links/components/sidebar-target.tsx";

const CreateThreadButton = ({ type }: { type: "compact" | "full" }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <SidebarButton
      id="create-thread"
      onClick={() => navigate({ to: CREATE_THREAD_URL })}
      variant={pathname === CREATE_THREAD_URL ? "active" : "default"}
      className="h-12"
    >
      <Pencil size={20} className="text-shark-300" />
      {type === "full" && (
        <Typography className="text-[16px] font-medium">
          Создать тред
        </Typography>
      )}
    </SidebarButton>
  );
};

export const CreateThread = () => {
  const { isCompact, isExpanded } = useSidebarControl();
  const isCollapsed = isCompact || !isExpanded;

  return (
    <div className="w-full">
      {isCollapsed ? (
        <div className="flex w-[50px] h-[50px]">
          <CreateThreadButton type="compact" />
        </div>
      ) : (
        <div className="flex w-full">
          <CreateThreadButton type="full" />
        </div>
      )}
    </div>
  );
};
