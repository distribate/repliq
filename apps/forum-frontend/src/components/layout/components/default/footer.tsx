import { Typography } from "@repo/ui/src/components/typography"
import Logotype from "@repo/assets/images/logotype.png"

const LINKS = [
  { label: "Статус", href: "https://status.fasberry.su", },
  { label: "Новости", href: "https://fasberry.su/news", },
  { label: "Помощь", href: "https://fasberry.su/help", },
  { label: "Вики", href: "https://fasberry.su/wiki", }
]

export const SOCIALS = [
  { label: "Телеграм", href: "https://api.fasberry.su/forum/shared/get-media/telegram", },
  { label: "Дискорд", href: "https://api.fasberry.su/forum/shared/get-media/discord", }
]

const FooterItem = ({ href, label }: { href: string, label: string }) => {
  return (
    <a id={label} href={href} rel="noreferrer" target="_blank" className="group">
      <Typography
        className="group-hover:underline group-hover:underline-offset-4 decoration-shark-100 text-base truncate text-shark-100"
      >
        {label}
      </Typography>
    </a>
  )
}

export const Footer = () => {
  return (
    <div id="footer" className="hidden lg:block biloba-background max-h-[180px] w-full rounded-xl overflow-hidden relative">
      <div className="flex items-start justify-center px-12 py-4 gap-4 bg-white/10 backdrop-blur-md h-full w-full">
        <a rel="noreferrer" href="https://fasberry.su" className="flex items-end gap-1 w-2/5">
          <img src={Logotype} alt="" width={36} height={36} loading="lazy" />
          <Typography className="text-3xl font-[Minecraft]">
            Fasberry
          </Typography>
        </a>
        <div className="flex items-start justify-between w-3/5 *:w-full">
          <div className="flex flex-col gap-2 items-start justify-start">
            <Typography className="font-semibold text-lg truncate">
              Ресурсы
            </Typography>
            <div className="flex flex-col gap-1">
              {LINKS.map(link => <FooterItem key={link.label} {...link} />)}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start justify-start">
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