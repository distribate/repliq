import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/src/components/sheet.tsx";
import { Menu, Search } from "lucide-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { Typography } from "@repo/ui/src/components/typography";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { forwardRef, HTMLAttributes, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator";
import { UserSettingsModal } from "#modals/user-settings/user-settings-modal.tsx";
import { useInView } from "react-intersection-observer";
import { cva, VariantProps } from "class-variance-authority";
import { SidebarButton } from "#sidebar/desktop/components/sidebar/sidebar-button.tsx";

const sidebarMobileVariants = cva(
  `flex items-center justify-between rounded-b-lg gap-6 z-[10] sticky top-0 w-full px-4 bg-shark-950 h-[60px]`,
  {
    variants: {
      variant: {
        blurred: "bg-opacity-60 backdrop-blur-md",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type SidebarMobileProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof sidebarMobileVariants>

export const SidebarMobileWrapper = forwardRef<HTMLDivElement, SidebarMobileProps>(({
  className, variant, ...props
}, ref) => {
  return <div className={sidebarMobileVariants({ variant, className })} {...props} ref={ref} />
});

type SidebarMobileButtonProps = {
  func?: () => void
  title: string
}

const SidebarMobileButton = ({ func, title }: SidebarMobileButtonProps) => {
  return (
    <SidebarButton className="h-10" onClick={func}>
      <Typography>
        {title}
      </Typography>
    </SidebarButton>
  )
}

export const SidebarMobile = () => {
  const [open, setOpen] = useState(false);
  const { nickname, donate, favorite_item } = getUser();
  const navigate = useNavigate()
  const { inView, ref } = useInView({ threshold: 1})

  const handle = (func?: () => void) => {
    setOpen(false)
    func && func()
  }

  return (
    <SidebarMobileWrapper ref={ref} variant={inView ? "blurred" : "default"} >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu size={32} className="text-shark-300" />
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto h-full">
          <div className="flex bg-shark-950 gap-4 p-4 flex-col">
            <Avatar nickname={nickname} propHeight={64} propWidth={64} />
            <div className="flex flex-col gap-1">
              <UserNickname nickname={nickname} className="text-[18px] font-medium text-shark-50" />
              <UserDonate donate={donate} favoriteItemId={favorite_item} />
            </div>
          </div>
          <div className="flex flex-col p-4 gap-y-4">
            <SidebarMobileButton title="Мой профиль" func={() => handle(() => navigate({ to: USER_URL + nickname }))} />
            <SidebarMobileButton title="Друзья" func={() => handle(() => navigate({ to: "/friends" }))} />
            <SidebarMobileButton title="Треды" func={() => handle(() => navigate({ to: "/" }))} />
            <Separator />
            <SidebarMobileButton title="Создать тред" func={() => handle(() => navigate({ to: "/create-thread" }))} />
            <Separator />
            <SidebarMobileButton title="Ивенты" func={() => handle(() => navigate({ to: "/events" }))} />
            <SidebarMobileButton title="Справочник" func={() => handle(() => navigate({ to: "https://fasberry.su/wiki" }))} />
            <SidebarMobileButton title="Территории" func={() => handle(() => navigate({ to: "/lands" }))} />
            <Separator />
            <SidebarMobileButton title="Коллекции" func={() => handle(() => navigate({ to: "/collections" }))} />
            <UserSettingsModal trigger={<SidebarMobileButton title="Настройки" />} />
          </div>
        </SheetContent>
      </Sheet>
      <Search
        onClick={() => handle(() => navigate({ to: "/search" }))}
        size={26}
        className="text-shark-300 cursor-pointer"
      />
    </SidebarMobileWrapper>
  );
};