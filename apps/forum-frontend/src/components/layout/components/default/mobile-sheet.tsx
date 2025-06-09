import { currentUserAtom, currentUserNicknameAtom } from "@repo/lib/helpers/get-user"
import { Sheet, SheetContent } from "@repo/ui/src/components/sheet.tsx"
import { atom } from "@reatom/core"
import { cva, VariantProps } from "class-variance-authority"
import { Typography } from "@repo/ui/src/components/typography"
import { router } from "#main"
import { UserDonate } from "#components/user/donate/components/donate"
import { UserNickname } from "#components/user/name/nickname"
import { Avatar } from "#components/user/avatar/components/avatar"
import { CustomLink } from "#components/shared/link"
import { toggleGlobalDialogAction } from "#components/modals/user-settings/models/user-settings.model"
import { logoutModalIsOpenAtom } from "#components/modals/action-confirmation/components/logout/models/logout.model"
import { reatomComponent } from "@reatom/npm-react"
import { House, Menu, Search, User } from "lucide-react"
import { HTMLAttributes } from "react"
import { useLocation } from "@tanstack/react-router"
import { Separator } from "@repo/ui/src/components/separator"
import { createIdLink } from "@repo/lib/utils/create-link"

const sheetMenuIsOpenAtom = atom(false, "sheetMenuIsOpen")

export const BottomBar = reatomComponent(({ ctx }) => {
  const pathname = useLocation({ select: p => p.pathname })
  const str = useLocation({ select: p => p.searchStr })

  const path = pathname + str;

  return (
    <div id="bottom-bar" style={{ height: '74px' }} className="md:hidden fixed bottom-0 w-full px-6 z-[45] bg-[#151515]">
      <div className="flex items-center gap-2 justify-between h-full w-full">
        <CustomLink
          to="/"
          data-state={path === "/"}
          className="text-shark-300 data-[state=true]:text-biloba-flower-500"
        >
          <House size={24} />
        </CustomLink>
        <CustomLink
          to="/search"
          search={{ type: "users" }}
          data-state={path === "/search?type=users"}
          className="text-shark-300 data-[state=true]:text-biloba-flower-500"
        >
          <Search size={24} />
        </CustomLink>
        <CustomLink
          to={createIdLink("user", ctx.spy(currentUserNicknameAtom)!)}
          data-state={path === createIdLink("user", ctx.spy(currentUserNicknameAtom)!)}
          className="text-shark-300 data-[state=true]:text-biloba-flower-500"
        >
          <User size={24} />
        </CustomLink>
        <Menu onClick={() => sheetMenuIsOpenAtom(ctx, true)} size={24} className="text-shark-300" />
      </div>
    </div>
  )
}, "BottomBar")

export const SheetMenu = reatomComponent(({ ctx }) => {
  const currentUser = ctx.spy(currentUserAtom)
  if (!currentUser) return null;

  const handle = async (callback: void | Promise<void>) => {
    sheetMenuIsOpenAtom(ctx, false)
    return callback
  }

  return (
    <Sheet open={ctx.spy(sheetMenuIsOpenAtom)} onOpenChange={v => sheetMenuIsOpenAtom(ctx, v)}>
      <SheetContent side="right" className="overflow-y-auto h-full w-3/5">
        <div className="flex bg-shark-950 gap-4 p-4 flex-col">
          <Avatar nickname={currentUser.nickname} propHeight={64} propWidth={64} />
          <div className="flex flex-col gap-1">
            <UserNickname nickname={currentUser.nickname} className="text-[18px] font-medium text-shark-50" />
            <UserDonate donate={currentUser.donate} />
          </div>
        </div>
        <div className="flex flex-col p-4 gap-y-4">
          <SidebarMobileButton
            titleButton="Профиль"
            func={() => handle(router.navigate({ to: `/user/` + currentUser.nickname }))}
          />
          <SidebarMobileButton
            titleButton="Друзья"
            func={() => handle(router.navigate({ to: "/friends" }))}
          />
          <SidebarMobileButton
            titleButton="Ивенты"
            func={() => handle(router.navigate({ to: "/events" }))}
          />
          <SidebarMobileButton
            titleButton="Коллекции"
            func={() => {
              handle(
                router.navigate({ to: "/collection", search: { type: "all" } })
              )
            }}
          />
          <SidebarMobileButton
            titleButton="Настройки"
            func={() => {
              handle(toggleGlobalDialogAction(ctx, { reset: true, value: true }))
            }}
          />
          <Separator />
          <SidebarMobileButton
            titleButton="Выйти"
            variant="negative"
            func={() => {
              // @ts-expect-error
              handle(logoutModalIsOpenAtom(ctx, true))
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}, "SheetMenu")

const sidebarButtonVariants = cva(`
  inline-flex duration-100 ease-in-out transition h-10 cursor-pointer items-center px-4 py-1 
  gap-x-4 rounded-md w-full justify-start`, {
  variants: {
    variant: {
      default: "bg-shark-800 hover:bg-shark-600",
      active: "bg-biloba-flower-500/40",
      negative: "bg-red-600/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type SidebarButtonProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof sidebarButtonVariants> & {
    func: () => void,
    titleButton: string,
  }

export const SidebarMobileButton = ({ variant, className, func, titleButton, ...props }: SidebarButtonProps) => {
  return (
    <div className={sidebarButtonVariants({ variant, className })} onClick={func} {...props}>
      <Typography>
        {titleButton}
      </Typography>
    </div>
  )
}