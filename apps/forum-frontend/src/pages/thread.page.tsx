import { ThreadMore } from '#components/thread/thread-more/components/thread-more'
import { ThreadsRecommendations } from '#components/thread/thread-recommendations/components/thread-recommendations'
import { ThreadCommentsSection } from '#components/thread/thread-comments/components/thread-comments'
import { Head, useSeoMeta } from '@unhead/react'
import { reatomComponent } from '@reatom/npm-react'
import { wrapTitle } from '@repo/lib/utils/wrap-title'
import { threadAtom, threadContentAtom } from '#components/thread/thread-main/models/thread.model'
import { serializeNodes } from '@repo/lib/helpers/nodes-serializer'
import { threadImagesAction } from '#components/thread/thread-images/models/thread-images.model'
import { THREAD_URL } from '@repo/shared/constants/routes'
import { KEYWORDS, PATHNAME } from '@repo/shared/constants/meta';
import { Thread } from '#components/thread/thread-main/components/thread-main'

const ThreadHead = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  const threadContent = ctx.get(threadContentAtom)

  const description = thread?.description ?? threadContent ? `${serializeNodes(threadContent).slice(0, 160)}...` : "..."
  const images = ctx.spy(threadImagesAction.dataAtom)

  const imagesIsExists = images && images.length >= 1

  useSeoMeta({
    title: wrapTitle(thread?.title),
    description: description,
    ogTitle: wrapTitle(thread?.title),
    ogDescription: description,
    ogUrl: PATHNAME + THREAD_URL + thread?.id,
    twitterTitle: wrapTitle(thread?.title),
    twitterDescription: description,
    ogImage: imagesIsExists ? { url: images[0], width: 1200, height: 600, alt: 'image', type: 'image/png' } : undefined,
    twitterImage: imagesIsExists ? { url: images[0], width: 1200, height: 600, alt: 'image', type: 'image/png' } : undefined
  })

  return (
    <Head>
      <title>{wrapTitle(thread?.title)}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={KEYWORDS} />
    </Head>
  )
})

export function ThreadRouteComponent() {
  return (
    <>
      <ThreadHead />
      <div className="flex xl:flex-row flex-col gap-2 items-start h-full w-full relative">
        <div
          className="flex flex-col order-first w-full gap-2
            xl:min-w-3/4 xl:w-3/4 relative xl:max-w-3/4 items-start h-full justify-start"
        >
          <Thread />
          <div className="flex w-full bg-shark-950 rounded-lg">
            <ThreadMore />
          </div>
          <ThreadCommentsSection />
        </div>
        <div
          className="flex flex-col order-last gap-y-4 
        lg:min-w-1/4 xl:w-1/4 w-full xl:max-w-1/4 h-fit relative xl:sticky top-0 overflow-hidden"
        >
          <ThreadsRecommendations />
        </div>
      </div>
    </>
  )
}