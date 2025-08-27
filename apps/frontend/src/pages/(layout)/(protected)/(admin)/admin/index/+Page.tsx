import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { UserNickname } from "#components/user/components/name/nickname";
import { forumAdminClient } from "#shared/forum-client";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { onConnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Typography } from "@repo/ui/src/components/typography";

const SECTIONS = [
  {
    title: "Статистика",
    styles: {
      color: "bg-authentic-border",
      height: "h-44"
    },
    value: "",
  },
  {
    title: "Открытые тикеты",
    styles: {
      color: "bg-gold-700",
      height: "h-36"
    },
    value: ""
  },
  {
    title: "Репорты",
    styles: {
      color: "bg-red-700",
      height: "h-28"
    },
    value: ""
  },
  {
    title: "Debug",
    styles: {
      color: "bg-green-700",
      height: "h-44"
    },
    value: ""
  },
  {
    title: "Админы",
    styles: {
      color: "bg-biloba-flower-700",
      height: "h-40"
    },
    value: ""
  },
  {
    title: "Модераторы",
    styles: {
      color: "bg-blue-700",
      height: "h-36"
    },
    value: ""
  },
]

const BackgroundImage = () => {
  return (
    <div className="flex absolute z-[1] w-full h-full">
      <img
        src="http://localhost:8000/storage/v1/object/public/static/backgrounds/pattern_light.png"
        alt=""
        draggable={false}
        className="w-full h-full select-none object-cover"
      />
    </div>
  )
}

const Sections = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-row-dense auto-rows-min h-full w-full">
      {SECTIONS.map((section) => (
        <div
          key={section.value}
          className={`${section.styles.color} ${section.styles.height} relative rounded-lg p-4`}
        >
          <BackgroundImage />
          <div className="flex flex-col relative z-[2]">
            <Typography className="text-2xl font-semibold text-shark-50">
              {section.title}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  )
}

const adminsListAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumAdminClient.private["get-admins"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )
    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data
  })
}, {
  name: "adminsListAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withDataAtom(), withStatusesAtom())

onConnect(adminsListAction.dataAtom, adminsListAction)

const AdminsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(adminsListAction.dataAtom);

  if (ctx.spy(adminsListAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) return null;

  return (
    data.map((user) => (
      <div
        key={user.nickname}
        className="flex bg-shark-900 rounded-lg p-2 items-center w-full"
      >
        <UserNickname nickname={user.nickname} />
        <Typography>
          {user.description}
        </Typography>
      </div>
    ))
  )
}, "AdminsList")

export default function AdminIndexPage() {
  return (
    <>
      <Sections />
      <div className="flex flex-col gap-4 w-full">
        <Typography className='text-2xl font-semibold'>
          Админы
        </Typography>
        <AdminsList />
      </div>
    </>
  )
}