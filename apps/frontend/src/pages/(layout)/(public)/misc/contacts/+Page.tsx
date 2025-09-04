import { Typography } from "@repo/ui/src/components/typography"
import { IconArrowRight } from "@tabler/icons-react"

const CONTACTS = [
  {
    title: "Telegram",
    value: "tg",
    img: "https://cristalix.gg/content/icons/tg.svg",
    color: "bg-[#007CBD]",
    href: "https://t.me/repliq_off",
  }
]

const Contacts = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-2 sm:gap-4 w-full">
      {CONTACTS.map((item, idx) => (
        <a
          href={item.href}
          key={idx}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center justify-between p-4 group rounded-lg ${item.color}`}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <img src={item.img} alt="TG" width={36} height={36} />
            <Typography className="truncate font-semibold text-lg lg:text-xl">
              {item.title}
            </Typography>
          </div>
          <IconArrowRight size={36} className="duration-150 -rotate-45 group-hover:rotate-0" />
        </a>
      ))}
    </div>
  )
}

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-2 rounded-xl p-4 w-full h-fit bg-primary-color">
        <Typography className="text-3xl font-bold text-shark-50">
          Полезные ссылки
        </Typography>
        <Contacts />
      </div>
    </div>
  )
}