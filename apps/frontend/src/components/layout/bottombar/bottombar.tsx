import { userGlobalOptionsAtom } from "#components/user/models/current-user.model";
import { CustomLink } from "#shared/components/link";
import { reatomComponent } from "@reatom/npm-react";
import { Typography } from "@repo/ui/src/components/typography";
import { IconBell, IconHome, IconMenu2, IconSearch } from "@tabler/icons-react";
import { usePageContext } from "vike-react/usePageContext";

const BottombarNotifications = reatomComponent<{ size?: number }>(({ ctx, size }) => {
  const hasNewNotifications = ctx.spy(userGlobalOptionsAtom).has_new_notifications;

  return (
    <>
      {hasNewNotifications && (
        <div
          className="absolute w-2 h-2 rounded-lg bg-green-500/80 bottom-4 right-7"
        />
      )}
      <IconBell size={size ?? 22} className="text-shark-300" />
    </>
  )
}, "BottombarNotifications")

const BOTTOM_LINKS = [
  { title: "Главная", value: "/home", icon: IconHome },
  { title: "Поиск", value: "/search", icon: IconSearch },
  { title: "Уведомления", value: "/notifications", icon: BottombarNotifications },
  { title: "Меню", value: "/menu", icon: IconMenu2 },
]

export const BottomBar = () => {
  const pathname = usePageContext().urlParsed.pathname;

  const isActive = (target: string) => pathname === target;

  return (
    <div
      id="bottom-bar"
      className="sm:hidden fixed bottom-0 z-[50] h-14 w-full bg-primary-color rounded-t-md"
    >
      <div className="flex items-center h-full gap-2 px-4 justify-between w-full">
        {BOTTOM_LINKS.map(({ value, title, icon: Icon }) => (
          <CustomLink
            key={value}
            to={value}
            aria-current={isActive(value) ? "page" : undefined}
            data-state={isActive(value) ? "active" : "inactive"}
            className="flex flex-col items-center relative data-[state=active]:text-shark-50 data-[state=inactive]:text-shark-300"
          >
            <Icon size={26} />
            <span className="sr-only">{title}</span>
            <Typography
              aria-label={title}
              className="hidden min-[350px]:block text-xs font-semibold text-nowrap truncate"
            >
              {title}
            </Typography>
          </CustomLink>
        ))}
      </div>
    </div>
  )
}