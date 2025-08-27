import { myThreadsAction } from "#components/collection/components/my-threads/models/my-threads.model"
import { onConnect, onDisconnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react"
import { Button } from "@repo/ui/src/components/button";
import { IconBrandThreads, IconImageInPicture, IconPencil, IconTrash } from "@tabler/icons-react";
import dayjs from "@repo/shared/constants/dayjs-instance"
import { createIdLink } from "#lib/create-link";
import { CustomLink } from "#shared/components/link";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";

onConnect(myThreadsAction.dataAtom, myThreadsAction)
onDisconnect(myThreadsAction.dataAtom, (ctx) => myThreadsAction.dataAtom.reset(ctx))

const ThreadsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(myThreadsAction.dataAtom);

  if (ctx.spy(myThreadsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) return null;

  return (
    <>
      <div className="flex items-center p-2 justify-between w-full">
        <div className="flex items-center justify-start w-3/6">
          <span className="text-shark-300">Тред</span>
        </div>
        <div className="flex items-center justify-start w-1/6">
          <span className="text-shark-300">Дата</span>
        </div>
        <div className="flex items-center justify-start w-1/6">
          <span className="text-shark-300">Просмотров</span>
        </div>
        <div className="flex items-center justify-start w-1/6 pr-4">
          <span className="text-shark-300">Комментариев</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {data.map((thread) => (
          <div
            key={thread.id}
            className="flex group items-center justify-between w-full p-2 bg-shark-900/40 rounded-lg"
          >
            <div className="flex items-center gap-2 h-full w-3/6">
              {thread.images.length >= 1 ? (
                <img src={thread.images[0]} alt={thread.title} className="w-28 h-18 object-cover rounded-lg" />
              ) : (
                <div className="w-28 h-18 bg-shark-800 rounded-md flex items-center justify-center">
                  <IconImageInPicture size={16} />
                </div>
              )}
              <div className="flex flex-col py-1 justify-between items-start h-full">
                <p className="font-semibold text-base">
                  {thread.title}
                </p>
                <div className="group-hover:hidden">
                  <span className="text-xs text-shark-500">
                    {thread.description}
                  </span>
                </div>
                <div className="hidden group-hover:flex items-center gap-2">
                  <CustomLink href={`/studio/thread/${thread.id}/edit`}>
                    <Button className="h-8 w-8 aspect-square hover:bg-shark-700">
                      <IconPencil size={18} />
                    </Button>
                  </CustomLink>
                  <Button className="h-8 w-8 aspect-square hover:bg-shark-700">
                    <IconTrash size={18} />
                  </Button>
                  <CustomLink href={createIdLink("thread", thread.id)}>
                    <Button className="h-8 w-8 aspect-square hover:bg-shark-700">
                      <IconBrandThreads size={18} />
                    </Button>
                  </CustomLink>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start w-1/6">
              <span>
                {dayjs(thread.created_at).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="flex items-center justify-start w-1/6">
              <span>
                {thread.views_count}
              </span>
            </div>
            <div className="flex items-center justify-start w-1/6 pr-4">
              <span>
                {thread.comments_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}, "ThreadsList")

export default function StudioThreadsPage() {
  return (
    <div className="flex flex-col gap-4 w-full overflow-x-auto min-w-[900px]">
      <ThreadsList />
    </div>
  )
}