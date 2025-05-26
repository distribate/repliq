import { Navbar } from "./navbar"
import { Cuboid, House, Menu, Search, User } from "lucide-react"
import { forwardRef, HTMLAttributes, PropsWithChildren } from "react"
import { reatomComponent } from "@reatom/npm-react"
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

const sheetMenuIsOpenAtom = atom(false, "sheetMenuIsOpen")

const BottomBar = reatomComponent(({ ctx }) => {
  return (
    <div id="bottom-bar" style={{ height: '74px' }} className="md:hidden fixed bottom-0 w-full px-6 z-[45] bg-[#151515]">
      <div className="flex items-center gap-2 justify-between h-full w-full">
        <CustomLink to="." className="text-shark-300 [&.active]:text-biloba-flower-500">
          <House size={24} />
        </CustomLink>
        <CustomLink to="/search" className="text-shark-300 [&.active]:text-biloba-flower-500">
          <Search size={24} />
        </CustomLink>
        <CustomLink to={`/user/` + ctx.spy(currentUserNicknameAtom)} className="text-shark-300 data-[status=active]:text-biloba-flower-500">
          <User size={24} />
        </CustomLink>
        <CustomLink to="/lands" className="text-shark-300 [&.active]:text-biloba-flower-500">
          <Cuboid size={24} />
        </CustomLink>
        <Menu onClick={() => sheetMenuIsOpenAtom(ctx, true)} size={24} className="text-shark-300" />
      </div>
    </div>
  )
}, "BottomBar")

const SheetMenu = reatomComponent(({ ctx }) => {
  const currentUser = ctx.spy(currentUserAtom)
  if (!currentUser) return;

  const handle = async (callback: void | Promise<void>) => {
    sheetMenuIsOpenAtom(ctx, false)
    return callback
  }

  return (
    <Sheet open={ctx.spy(sheetMenuIsOpenAtom)} onOpenChange={v => sheetMenuIsOpenAtom(ctx, v)}>
      <SheetContent side="right" className="overflow-y-auto h-full w-2/4">
        <div className="flex bg-shark-950 gap-4 p-4 flex-col">
          <Avatar nickname={currentUser.nickname} propHeight={64} propWidth={64} />
          <div className="flex flex-col gap-1">
            <UserNickname nickname={currentUser.nickname} className="text-[18px] font-medium text-shark-50" />
            <UserDonate donate={currentUser.donate} />
          </div>
        </div>
        <div className="flex flex-col p-4 gap-y-4">
          <SidebarMobileButton title="Профиль" func={() => handle(router.navigate({ to: `/user/` + currentUser.nickname }))} />
          <SidebarMobileButton title="Друзья" func={() => handle(router.navigate({ to: "/friends" }))} />
          <SidebarMobileButton title="Ивенты" func={() => handle(router.navigate({ to: "/events" }))} />
          <SidebarMobileButton title="Рейтинг" func={() => handle(router.navigate({ to: "/ratings" }))} />
          <SidebarMobileButton title="Территории" func={() => handle(router.navigate({ to: "/lands" }))} />
          <SidebarMobileButton title="Коллекции" func={() => handle(router.navigate({ to: "/collection", search: { type: "all" } }))} />
        </div>
      </SheetContent>
    </Sheet>
  )
})

const sidebarButtonVariants = cva("inline-flex duration-100 ease-in-out transition cursor-pointer items-center px-4 py-1 gap-x-4 rounded-md w-full justify-start", {
  variants: {
    variant: {
      default: "border-2 border-transparent bg-shark-800 hover:bg-shark-600",
      active: "border-2 border-biloba-flower-500 bg-biloba-flower-500/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type SidebarButtonProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarButtonVariants>

export const SidebarButton = forwardRef<HTMLDivElement, SidebarButtonProps>(({
  variant, className, ...props
}, ref) => {
  return <div className={sidebarButtonVariants({ variant, className })} {...props} ref={ref} />
})

const SidebarMobileButton = ({ func, title }: { func: () => void, title: string }) => {
  return (
    <SidebarButton className="h-10" onClick={func}>
      <Typography>
        {title}
      </Typography>
    </SidebarButton>
  )
}

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full relative min-h-screen items-center pt-4 pb-[80px] md:py-4 justify-center overflow-hidden">
      <div className="flex flex-col gap-4 responsive-width h-full items-center justify-start">
        <Navbar />
        <BottomBar />
        <SheetMenu />
        <div id="main" className="flex gap-y-4 w-full h-full min-h-screen main-section">
          {children}
        </div>
      </div>
    </div>
  )
}