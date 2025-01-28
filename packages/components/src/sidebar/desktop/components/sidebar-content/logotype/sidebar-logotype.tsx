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
      className="flex bg-shark-50/10 backdrop-blur-md py-4 rounded-md items-center justify-center w-full select-none"
    >
      {isCompact || !isExpanded ? (
        <img
          src={Logotype}
          width={36}
          height={36}
          alt=""
          draggable={false}
          loading="lazy"
        />
      ) : (
        <>
          <img
            src={Logotype}
            width={32}
            height={32}
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
