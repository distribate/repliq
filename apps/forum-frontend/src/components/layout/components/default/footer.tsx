import { Typography } from "@repo/ui/src/components/typography"
import { STATUS_SITE_DOMAIN } from "@repo/shared/constants/origin-list"
import { CustomLink } from "#components/shared/link"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { IconBrandDiscord, IconBrandGithub, IconBrandTelegram } from "@tabler/icons-react"

const LINKS = [
  { label: "Статус", href: STATUS_SITE_DOMAIN, },
  { label: "Обновления", href: `/news/changelog`, },
]

const PRODUCTS = [
  { label: "Minecraft", href: "https://mc.fasberry.su" },
  { label: "Archivio", href: "https://mvp.fasberry.su" },
]

const TERMS = [
  { label: "Конфиденциальность", href: "/legal/privacy" },
  { label: "Контакты", href: "/legal/contacts" },
]

export const SOCIALS = [
  { label: "Телеграм", icon: IconBrandTelegram, href: "https://api.fasberry.su/forum/shared/get-media/telegram", },
  { label: "Дискорд", icon: IconBrandDiscord, href: "https://api.fasberry.su/forum/shared/get-media/discord", },
  { label: "Github", icon: IconBrandGithub, href: "https://github.com/ProjectFasberry" }
]

const FooterItem = ({ href, label }: { href: string | null, label: string }) => {
  const navigate = useNavigate()

  const handle = () => {
    if (!href) {
      toast.info("Ресурс не доступен")
      return
    }

    navigate({
      href: href, reloadDocument: true,
    })
  }

  return (
    <span onClick={handle} className="group cursor-pointer" >
      <Typography
        className="group-hover:underline group-hover:underline-offset-4 decoration-shark-100 text-base truncate text-shark-100"
      >
        {label}
      </Typography>
    </span>
  )
}

const Links = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row items-start justify-between w-full lg:w-4/6 *:w-full">
      <div className="flex flex-col gap-1 lg:gap-2 items-start justify-start">
        <Typography className="font-semibold text-lg truncate">
          Информация
        </Typography>
        <div className="flex flex-col gap-1">
          {LINKS.map(link => <FooterItem key={link.label} {...link} />)}
        </div>
      </div>
      <div className="flex flex-col gap-1 lg:gap-2 items-start justify-start">
        <Typography className="font-semibold text-lg truncate">
          Продукты
        </Typography>
        <div className="flex flex-col items-start w-full gap-1">
          {PRODUCTS.map(link => <FooterItem key={link.label} {...link} />)}
        </div>
      </div>
      <div className="flex flex-col gap-1 lg:gap-2 items-start justify-start">
        <Typography className="font-semibold text-lg truncate">
          Условия
        </Typography>
        <div className="flex flex-col items-start w-full gap-1">
          {TERMS.map(link => <FooterItem key={link.label} {...link} />)}
        </div>
      </div>
    </div>
  )
}

const CompactFooter = () => {
  return (
    <div
      className="block biloba-background w-full rounded-xl overflow-hidden relative"
    >
      <div
        className="flex flex-col lg:flex-row items-start lg:justify-center px-4 lg:px-12 py-4 gap-4 bg-white/10 backdrop-blur-md h-full w-full"
      >
        <div className="flex items-center gap-2 w-full justify-between">
          <Logotype />
          <Socials />
        </div>
      </div>
    </div>
  )
}

const Logotype = () => {
  return (
    <CustomLink to="/" className="flex items-end gap-1">
      <img src="/images/logotype.png" alt="" width={32} height={32} loading="lazy" />
      <Typography textSize="very_big" font="pixy">
        Fasberry
      </Typography>
    </CustomLink>
  )
}

const Socials = () => {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(social => (
        <a
          key={social.label}
          title={social.label}
          href={social.href}
          rel="noreferrer"
          target="_blank"
          className="hover:bg-shark-300/10 rounded-full p-1.5"
        >
          <social.icon size={24} className="text-shark-300" />
        </a>
      ))}
    </div>
  )
}

export const Footer = () => {
  const pathname = useLocation().pathname

  if (pathname !== '/') {
    return <CompactFooter />
  }

  return (
    <div
      className="block biloba-background lg:max-h-[180px] w-full rounded-xl overflow-hidden relative"
    >
      <div
        className="flex flex-col lg:flex-row items-start lg:justify-center px-4 lg:px-12 py-4 gap-4 bg-white/10 backdrop-blur-md h-full w-full"
      >
        <div className="flex flex-col gap-2 w-full lg:w-2/6">
          <Logotype/>
          <Socials/>
          <span className="mt-4 font-semibold text-sm text-shark-300">
            © {new Date().getFullYear()} Fasberry.
          </span>
        </div>
        <Links />
      </div>
    </div>
  )
}