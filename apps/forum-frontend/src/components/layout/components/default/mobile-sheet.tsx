import { currentUserNicknameAtom, getUser } from "#components/user/models/current-user.model"
import { Sheet, SheetContent, SheetTitle } from "@repo/ui/src/components/sheet.tsx"
import { atom } from "@reatom/core"
import { cva, VariantProps } from "class-variance-authority"
import { Typography } from "@repo/ui/src/components/typography"
import { UserDonate } from "#components/user/donate/components/donate"
import { UserNickname } from "#components/user/name/nickname"
import { Avatar } from "#components/user/avatar/components/avatar"
import { CustomLink } from "#components/shared/link"
import { toggleGlobalDialogAction } from "#components/modals/user-settings/models/user-settings.model"
import { logoutModalIsOpenAtom } from "#components/modals/action-confirmation/components/logout/models/logout.model"
import { reatomComponent } from "@reatom/npm-react"
import { House, Menu, Search, User } from "lucide-react"
import { HTMLAttributes } from "react"
import { Separator } from "@repo/ui/src/components/separator"
import { createIdLink } from "@repo/lib/utils/create-link"
import { usePageContext } from "vike-react/usePageContext"
import { navigate } from "vike/client/router"

const sheetMenuIsOpenAtom = atom(false, "sheetMenuIsOpen")

export const BottomBar = reatomComponent(({ ctx }) => {
  const pathname = usePageContext().urlPathname
  const str = usePageContext().urlParsed.search

  const path = pathname + str;

  return (
    <div id="bottom-bar" style={{ height: '74px' }} className="md:hidden fixed bottom-0 w-full px-6 z-[45] bg-[#151515]">
      <div className="flex items-center gap-2 justify-between h-full w-full">
        <CustomLink
          to="/home"
          data-state={path === "/"}
          className="text-shark-300 data-[state=true]:text-biloba-flower-500"
        >
          <House size={24} />
        </CustomLink>
        <CustomLink
          to="/search"
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
  const { nickname, avatar, is_donate } = getUser(ctx)

  const handle = async (fn: void | Promise<void>) => {
    sheetMenuIsOpenAtom(ctx, false)
    return fn
  }

  return (
    <Sheet open={ctx.spy(sheetMenuIsOpenAtom)} onOpenChange={v => sheetMenuIsOpenAtom(ctx, v)}>
      <SheetContent side="right" className="overflow-y-auto rounded-md h-full w-3/5">
        <SheetTitle className="hidden"></SheetTitle>
        <div className="flex bg-shark-950 gap-4 p-4 flex-col">
          {/* <div className="max-w-[64px] max-h-[64px]"> */}
            <Avatar
              url={avatar}
              nickname={nickname}
              propHeight={64}
              propWidth={64}
              className="max-w-[64px] max-h-[64px]"
            />
          {/* </div> */}
          <div className="flex flex-col gap-1">
            <UserNickname nickname={nickname} className="text-[18px] font-medium text-shark-50" />
            <UserDonate is_donate={is_donate} />
          </div>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="flex flex-col gap-4 w-full h-full">
            <SidebarMobileButton
              titleButton="Профиль"
              onClick={() => handle(navigate(createIdLink("user", nickname)))}
            />
            <SidebarMobileButton
              titleButton="Друзья"
              onClick={() => handle(navigate("/friends"))}
            />
            <SidebarMobileButton
              titleButton="Создать тред"
              onClick={() => handle(navigate("/create-thread"))}
            />
            <SidebarMobileButton
              titleButton="Коллекции"
              onClick={() => handle(navigate(`/collection?type=all`))}
            />
            <SidebarMobileButton
              titleButton="Настройки"
              onClick={() => handle(toggleGlobalDialogAction(ctx, { reset: true, value: true }))}
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 w-full h-full">
            <SidebarMobileButton
              titleButton="Создать тикет"
              onClick={() => handle(navigate("/create-ticket"))}
            />
            <SidebarMobileButton
              titleButton="Новости проекта"
              onClick={() => handle(navigate("/news"))}
            />
            <SidebarMobileButton
              titleButton="Выйти"
              variant="negative"
              onClick={() => handle(void logoutModalIsOpenAtom(ctx, true))}
            />
          </div>
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
    onClick: () => void,
    titleButton: string,
  }

export const SidebarMobileButton = ({ variant, className, onClick, titleButton, ...props }: SidebarButtonProps) => {
  return (
    <div className={sidebarButtonVariants({ variant, className })} onClick={onClick} {...props}>
      <Typography>
        {titleButton}
      </Typography>
    </div>
  )
}