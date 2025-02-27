import { Separator } from "@repo/ui/src/components/separator.tsx";
import { CreateThread } from "../sidebar-content/create-thread/create-thread.tsx";
import { SidebarLogotype } from "../sidebar-content/logotype/sidebar-logotype.tsx";
import { HistoryThreads } from "../sidebar-content/history-threads/history-threads.tsx";
import { SidebarTarget } from "../sidebar-content/links/components/sidebar-target.tsx";
import { useSidebarControl } from "../sidebar-layout/hooks/use-sidebar-control.ts";
import {
  SidebarFormat,
  sidebarLayoutQuery,
} from "../sidebar-layout/queries/sidebar-layout-query.ts";
import { SidebarLayout } from "../sidebar-layout/components/sidebar-layout.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { HTMLAttributes } from "react";
import { ArrowDown, CircleUserRound, NotebookPen, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Icon } from "@repo/shared/ui/icon/icon.tsx";
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"
import Belkoin from "@repo/assets/images/minecraft/belkoin_wallet.png"
import { Suspense } from 'react'
import { userGlobalOptionsQuery } from "@repo/lib/queries/user-global-options-query.ts";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserMenu } from "../sidebar-content/user-menu/user-menu.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { SidebarButton } from "./sidebar-button.tsx";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { useQuery } from "@tanstack/react-query";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";

type SidebarLayoutVariant = Exclude<SidebarFormat, "dynamic">;

export const SIDEBAR_FORMATS: {
  title: string;
  value: SidebarFormat;
}[] = [
    { title: "Резиновый", value: "dynamic", },
    { title: "Раскрыт", value: "full", },
    { title: "Минимал", value: "compact" },
  ];

export const SIDEBAR_LINKS = [
  {
    title: "Мониторинги",
    link: "/misc/monitorings",
  },
  {
    title: "Статус",
    link: "/misc/status",
  },
  {
    title: "О нас",
    link: "/misc/about"
  }
]

const OutlineWrapper = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`flex items-center bg-shark-800 justify-center 
        hover:bg-shark-700 py-3 px-4 duration-300 ease-in-out transition-all cursor-pointer rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

async function getUserBalance(nickname: string) {
  const res = await forumUserClient.user["get-user-balance"][":nickname"].$get({
    param: { nickname }
  });

  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

const userBalanceQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey("user", ["balance"]),
  queryFn: () => getUserBalance(nickname),
  refetchOnWindowFocus: false
})

const UserBalance = () => {
  const { nickname, name_color } = getUser();
  const { data: balance, isLoading } = userBalanceQuery(nickname);

  return (
    <div className="flex flex-col items-start max-w-[200px] overflow-hidden">
      <div className="flex items-center gap-1">
        <UserNickname className="text-base truncate" nicknameColor={name_color} nickname={nickname} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-center">
          <Typography className="text-[15px] font-[Minecraft]">
            {isLoading ? <Skeleton className="w-2 h-2" /> : balance?.charism}
          </Typography>
          <img src={Charism} width={16} height={16} alt="" />
        </div>
        <div className="flex gap-1 items-center">
          <Typography className="text-[15px] font-[Minecraft]">
            {isLoading ? <Skeleton className="w-2 h-2" /> : balance?.belkoin}
          </Typography>
          <img src={Belkoin} width={15} height={15} alt="" />
        </div>
      </div>
    </div>
  )
}

const UserMenuTrigger = () => {
  const { data: { nickname } } = currentUserQuery();
  const { isExpanded, isCompact } = useSidebarControl();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full group focus-visible:outline-none">
        <div className="flex items-center justify-between w-full pr-2 bg-shark-800 hover:bg-shark-700 rounded-lg">
          <div
            className={`flex gap-x-3 items-center w-full
					  ${!isCompact ? "justify-start" : isExpanded ? "justify-start" : "justify-center"}`}
          >
            <Suspense fallback={<Skeleton className="w-[50px] h-[50px]" />}>
              <Avatar
                variant="default"
                className="overflow-hidden min-w-[50px] min-h-[50px]"
                propWidth={50}
                propHeight={50}
                nickname={nickname}
              />
            </Suspense>
            {!isCompact && <UserBalance />}
          </div>
          {!isCompact && (
            <ArrowDown
              size={24}
              className="transition-all duration-150 ease-in group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180 text-shark-300"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <UserMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SidebarBarNotifications = () => {
  const { data } = userGlobalOptionsQuery();
  const navigate = useNavigate()

  return (
    <OutlineWrapper
      onClick={() => navigate({ to: "/notifications" })}
      title="Уведомления"
      className="w-full relative"
    >
      {data?.has_new_notifications &&
        <div className="bg-red-500 w-[16px] h-[16px] rounded-[999px] absolute top-4 right-4" />
      }
      <Icon name="sprite/bell" className="text-xl text-shark-300" />
    </OutlineWrapper>
  )
}

const SidebarBar = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { updateSidebarPropertiesMutation } = useSidebarControl();
  const navigate = useNavigate()

  return (
    <>
      <OutlineWrapper
        title="Открыть тикет"
        onClick={() => navigate({ to: "/create-ticket" })}
      >
        <NotebookPen size={20} className="icon-color" />
      </OutlineWrapper>
      <SidebarBarNotifications />
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <OutlineWrapper className="w-full">
            <Settings size={20} className="icon-color" />
          </OutlineWrapper>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="flex flex-col gap-y-2 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex px-2 py-1.5 items-center justify-start hover:bg-shark-600 rounded-md">
                  <Typography>Формат сайдбара</Typography>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end">
                <div className="flex flex-col gap-y-2 w-full">
                  {SIDEBAR_FORMATS.map(({ title, value: format }) => (
                    <DropdownMenuItem
                      key={title}
                      onClick={e => {
                        e.preventDefault();
                        updateSidebarPropertiesMutation.mutate({
                          type: "format",
                          values: { format },
                        });
                      }}
                    >
                      <Typography
                        state={sidebarState.format === format ? "active" : "default"}
                        textSize="medium"
                      >
                        {title}
                      </Typography>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Separator />
            {SIDEBAR_LINKS.map((link, i) => (
              <>
                <Link
                  to={link.link}
                  className="flex cursor-pointer px-2 py-1.5 items-center justify-start hover:bg-shark-600 rounded-md"
                >
                  <Typography>{link.title}</Typography>
                </Link>
                {i === (SIDEBAR_LINKS.length - 2) && <Separator />}
              </>
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
    !isCompact && isExpanded ? (
      <div className="flex lg:flex-row items-center *:w-1/3 gap-2 w-full justify-between">
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
    )
  );
};

const ProfileLink = () => {
  const currentUser = getUser();
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const { isCompact, isExpanded } = useSidebarControl();

  return (
    <div className="h-12 w-full">
      <SidebarButton
        className="h-12"
        onClick={() => navigate({ to: USER_URL + currentUser.nickname })}
        variant={pathname === USER_URL + currentUser.nickname ? "active" : "default"}
      >
        <CircleUserRound size={20} className="icon-color" />
        {!isCompact && isExpanded && (
          <Typography className="text-[16px] font-medium">
            Мой профиль
          </Typography>
        )}
      </SidebarButton>
    </div>
  );
};

export const SidebarDesktop = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { isExpanded, isDynamic, isCompact } = useSidebarControl();

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
        <Separator />
        <UserMenuTrigger />
        <Separator orientation="horizontal" />
        <ProfileLink />
        <Separator />
        <CreateThread />
        <Separator orientation="horizontal" />
        <div className="flex flex-col h-full justify-between w-full">
          <div className="flex flex-col gap-y-4 items-center w-full">
            <div className="flex flex-col gap-y-4 items-center w-full">
              <HistoryThreads />
              <SidebarTarget />
            </div>
          </div>
          <SidebarDesktopContent />
        </div>
      </div>
    </SidebarLayout>
  );
};