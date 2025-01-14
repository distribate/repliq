"use client";

import { Separator } from "@repo/ui/src/components/separator.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { SidebarDesktopSkeleton } from "./sidebar-desktop-skeleton.tsx";
import { CreateThread } from "../sidebar-content/create-thread/create-thread.tsx";
import { SidebarLogotype } from "../sidebar-content/logotype/sidebar-logotype.tsx";
import { searchQuery } from "../sidebar-content/search/queries/search-query.ts";
import { SearchInput } from "../sidebar-content/search/components/search-input.tsx";
import { HistoryThreads } from "../sidebar-content/history-threads/history-threads.tsx";
import { SidebarTarget } from "../sidebar-content/links/components/sidebar-target.tsx";
import { useSidebarControl } from "../sidebar-layout/hooks/use-sidebar-control.ts";
import {
  SidebarFormat,
  sidebarLayoutQuery,
} from "../sidebar-layout/queries/sidebar-layout-query.ts";
import { SidebarLayout } from "../sidebar-layout/components/sidebar-layout.tsx";
import dynamic from "next/dynamic";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserMenu } from "#sidebar/desktop/components/sidebar-content/user-menu/user-menu.tsx";
import { HTMLAttributes } from "react";
import { CircleFadingPlus, NotebookPen, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { useRouter } from "next/navigation";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { TicketsModal } from "#modals/custom/tickets-modal.tsx";
import { Icon } from "@repo/shared/ui/icon/icon.tsx";
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import Belkoin from "@repo/assets/images/minecraft/belkoin_wallet.png"

type SidebarLayoutVariant = Exclude<SidebarFormat, "dynamic">;

const SearchArea = dynamic(() =>
  import("../sidebar-content/search/components/search-area.tsx").then(
    (m) => m.SearchArea,
  ),
);

type SidebarFormats = {
  title: string;
  value: SidebarFormat;
};

export const SIDEBAR_FORMATS: SidebarFormats[] = [
  {
    title: "Резиновый",
    value: "dynamic",
  },
  {
    title: "Раскрыт",
    value: "full",
  },
  {
    title: "Минимал",
    value: "compact",
  },
];

interface OutlineWrapperProps extends HTMLAttributes<HTMLDivElement> { }

const OutlineWrapper = ({ children, className, ...props }: OutlineWrapperProps) => {
  return (
    <div
      className={`flex items-center bg-shark-800 justify-center 
        hover:bg-shark-700 py-3 px-4 cursor-pointer rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const UserMenuTrigger = () => {
  const currentUser = getUser();
  const { nickname, name_color } = currentUser;
  const { isExpanded, isCompact } = useSidebarControl();

  return (
    <DropdownWrapper
      trigger={
        <div
          className={`flex gap-x-3 items-center bg-shark-800 hover:bg-shark-700 rounded-md w-full
					${!isCompact ? "justify-start" : isExpanded ? "justify-start" : "justify-center"}`}
        >
          <Avatar
            variant="default"
            className="overflow-hidden min-w-[50px] min-h-[50px]"
            propWidth={50}
            propHeight={50}
            nickname={nickname}
          />
          {!isCompact && (
            <div className="flex flex-col items-start max-w-[200px] overflow-hidden">
              <div className="flex items-center gap-1">
                <UserNickname className="text-base truncate" nicknameColor={name_color} nickname={nickname} />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 items-center">
                  <Typography className="text-[15px]">
                    1
                  </Typography>
                  <img src={Charism.src} width={16} height={16} alt="" />
                </div>
                <div className="flex gap-1 items-center">
                  <Typography className="text-[15px]">
                    1
                  </Typography>
                  <img src={Belkoin.src} width={15} height={15} alt="" />
                </div>
              </div>
            </div>
          )}
        </div>
      }
      content={<UserMenu />}
    />
  );
};

const SidebarBar = () => {
  const { data: searchState } = searchQuery();
  const { data: sidebarState } = sidebarLayoutQuery();
  const { updateSidebarPropertiesMutation } = useSidebarControl();
  const { replace } = useRouter()

  if (searchState.queryValue) return <SearchArea />

  return (
    <>
      <OutlineWrapper
        title="Нашли баг? Откройте заявку!"
        onClick={() => replace("/create-issue")}
      >
        <NotebookPen size={20} className="text-shark-300" />
      </OutlineWrapper>
      <TicketsModal
        trigger={
          <OutlineWrapper title="Открыть тикет">
            <CircleFadingPlus size={20} className="text-shark-300" />
          </OutlineWrapper>
        }
      />
      <OutlineWrapper onClick={() => replace("/notifications")} title="Уведомления" className="w-full">
        <Icon name="sprite/bell" className="text-xl text-shark-300" />
      </OutlineWrapper>
      <DropdownMenu>
        <DropdownMenuTrigger title="Настройки сайдбара" className="w-full">
          <OutlineWrapper className="w-full">
            <Settings size={20} className="text-shark-300" />
          </OutlineWrapper>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col gap-y-2">
            {SIDEBAR_FORMATS.map(({ title, value }) => (
              <DropdownMenuItem
                key={title}
                onClick={e => {
                  e.preventDefault();
                  updateSidebarPropertiesMutation.mutate({
                    type: "format",
                    values: { format: value },
                  });
                }}
              >
                <Typography state={sidebarState.format === value ? "active" : "default"}>
                  {title}
                </Typography>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}


const SidebarDesktopContent = () => {
  const { isCompact, isExpanded } = useSidebarControl();

  return (
    <div className="flex flex-col h-full justify-between w-full">
      <div className="flex flex-col gap-y-4 items-center w-full">
        <div className="flex flex-col gap-y-4 items-center w-full">
          <HistoryThreads />
          <SidebarTarget />
        </div>
      </div>
      {!isCompact && isExpanded ? (
        <div className="flex lg:flex-row items-center *:w-1/4 gap-2 w-full justify-between">
          <SidebarBar />
        </div>
      ) : (
        <div className="flex w-full aspect-square items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <OutlineWrapper className="w-full">
                <Settings size={20} className="text-shark-300" />
              </OutlineWrapper>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="min-w-fit">
              <div className="flex flex-col gap-2 *:w-12 *:aspect-square *:h-12 w-full h-full">
                <SidebarBar />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export const SidebarDesktop = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { isLoading } = currentUserQuery();
  const { isExpanded, isDynamic, isCompact } = useSidebarControl();

  if (isLoading) return <SidebarDesktopSkeleton />;

  const sidebarLayoutVariant = isDynamic
    ? "default"
    : (sidebarState.format as SidebarLayoutVariant);

  return (
    <SidebarLayout
      variant={sidebarLayoutVariant}
      padding={
        !isCompact && isExpanded ? "big" : isCompact ? "small" : "medium"
      }
    >
      <div className="biloba-gradient opacity-30 w-full h-[160px] z-[1] absolute left-0 right-0 top-0" />
      <div className="flex flex-col gap-y-4 items-center z-[2] h-full justify-start w-full">
        <SidebarLogotype />
        {!isCompact && isExpanded && <SearchInput />}
        <Separator />
        <UserMenuTrigger />
        <Separator orientation="horizontal" />
        <CreateThread />
        <Separator orientation="horizontal" />
        <SidebarDesktopContent />
      </div>
    </SidebarLayout>
  );
};
