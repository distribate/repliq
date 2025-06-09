import { Typography } from "@repo/ui/src/components/typography"
import Logotype from "@repo/assets/images/logotype.png"
import { STATUS_SITE_DOMAIN } from "@repo/shared/constants/origin-list"
import { CustomLink } from "#components/shared/link"
import { useNavigate } from "@tanstack/react-router"

const LINKS = [
  { label: "Статус", href: STATUS_SITE_DOMAIN, },
  // { label: "Новости", href: `${MINECRAFT_SITE_DOMAIN}/news`, },
  // { label: "Помощь", href: `${MINECRAFT_SITE_DOMAIN}/help`, },
  // { label: "Вики", href: `${MINECRAFT_SITE_DOMAIN}/wiki`, }
]

export const SOCIALS = [
  { label: "Телеграм", href: "https://api.fasberry.su/forum/shared/get-media/telegram", },
  { label: "Дискорд", href: "https://api.fasberry.su/forum/shared/get-media/discord", }
]

const FooterItem = ({ href, label }: { href: string, label: string }) => {
  const navigate = useNavigate()

  return (
    <span
      onClick={() =>
        navigate({
          href: href,
          reloadDocument: true,
        })
      }
      className="group cursor-pointer"
    >
      <Typography
        className="group-hover:underline group-hover:underline-offset-4 decoration-shark-100 text-base truncate text-shark-100"
      >
        {label}
      </Typography>
    </span>
  )
}

export const Footer = () => {
  return (
    <div id="footer" className="block biloba-background lg:max-h-[180px] w-full rounded-xl overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-start lg:justify-center px-4 lg:px-12 py-4 gap-4 bg-white/10 backdrop-blur-md h-full w-full">
        <CustomLink to="/" className="flex items-end gap-1 w-full lg:w-2/5">
          <img src={Logotype} alt="" width={32} height={32} loading="lazy" />
          <Typography textSize="very_big" font="pixy">
            Fasberry
          </Typography>
        </CustomLink>
        <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row items-start justify-between w-full lg:w-3/5 *:w-full">
          <div className="flex flex-col gap-1 lg:gap-2 items-start justify-start">
            <Typography className="font-semibold text-lg truncate">
              Ресурсы
            </Typography>
            <div className="flex flex-col gap-1">
              {LINKS.map(link => <FooterItem key={link.label} {...link} />)}
            </div>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2 items-start justify-start">
            <Typography className="font-semibold text-lg truncate">
              Социальные сети
            </Typography>
            <div className="flex flex-col gap-1">
              {SOCIALS.map(social => <FooterItem key={social.label} {...social} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}