import { Pencil } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useSidebarControl } from "../../sidebar-layout/hooks/use-sidebar-control.ts";
import { CREATE_THREAD_URL } from "@repo/shared/constants/routes.ts";
import { useRouter } from "next/navigation";

const CreateThreadButton = ({ type }: { type: "compact" | "full" }) => {
  const { push } = useRouter();

  return (
    <div
      id="create-thread"
      onClick={() => push(CREATE_THREAD_URL)}
      className="inline-flex items-center px-4 cursor-pointer py-3 rounded-md bg-shark-800 hover:bg-shark-700 group gap-4 w-full justify-start"
    >
      <Pencil size={20} className="text-shark-300" />
      {type === "full" && (
        <Typography className="text-[16px] font-medium">
          Создать тред
        </Typography>
      )}
    </div>
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
