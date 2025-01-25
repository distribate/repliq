import Logotype from "@repo/assets/images/logotype.png";
import { Link } from "@tanstack/react-router";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useSidebarControl } from "../../sidebar-layout/hooks/use-sidebar-control.ts";

export const SidebarLogotype = () => {
  const { isCompact, isExpanded } = useSidebarControl();

  return (
    <Link
      title="Главная"
      to="."
      className="flex items-center justify-center w-full select-none"
    >
      {isCompact || !isExpanded ? (
        <img
          src={Logotype}
          width={42}
          height={42}
          alt=""
          draggable={false}
          loading="lazy"
        />
      ) : (
        <>
          <img
            src={Logotype}
            width={42}
            className="h-[42px] w-[42px]"
            height={42}
            alt=""
            draggable={false}
            loading="lazy"
          />
          <div className="w-fit ml-2">
            <Typography
              textSize="very_big"
              textColor="shark_white"
              font="minecraft"
              className="truncate"
            >
              Fasberry
            </Typography>
          </div>
        </>
      )}
    </Link>
  );
};
