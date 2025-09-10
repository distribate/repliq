import { AdminsList } from "#components/admin/configs/admins/components/admins";
import { getStaticObject } from "#shared/utils/storage";
import { Typography } from "@repo/ui/src/components/typography";

const SECTIONS = [
  {
    title: "Статистика",
    styles: { color: "bg-emerald-border", height: "h-44" },
    value: "",
  },
  {
    title: "Открытые тикеты",
    styles: { color: "bg-gold-700", height: "h-36" },
    value: ""
  },
  {
    title: "Репорты",
    styles: { color: "bg-red-700", height: "h-28" },
    value: ""
  },
  {
    title: "Debug",
    styles: { color: "bg-green-700", height: "h-44" },
    value: ""
  },
  {
    title: "Админы",
    styles: { color: "bg-biloba-flower-700", height: "h-40" },
    value: ""
  },
  {
    title: "Модераторы",
    styles: { color: "bg-blue-700", height: "h-36" },
    value: ""
  },
]

const Sections = () => {
  return SECTIONS.map((section) => (
    <div
      key={section.value}
      className={`${section.styles.color} ${section.styles.height} relative rounded-lg p-4`}
    >
      <div className="flex absolute z-[1] w-full h-full">
        <img
          src={getStaticObject("backgrounds/pattern_light.png")}
          alt=""
          draggable={false}
          className="w-full h-full select-none object-cover"
        />
      </div>
      <div className="flex flex-col relative z-[2]">
        <Typography className="text-2xl font-semibold text-shark-50">
          {section.title}
        </Typography>
      </div>
    </div>
  ))
}

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-row-dense auto-rows-min h-full w-full">
        <Sections />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Typography className='text-2xl font-semibold'>
          Админы
        </Typography>
        <AdminsList />
      </div>
    </>
  )
}