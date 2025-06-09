import { CollectionNavigation } from '#components/collection/components/navigation/components/collection-navigation'
import { CollectionWrapper } from '#components/collection/components/collection-wrapper/collection-wrapper'
import { Head } from '@unhead/react'
import { wrapTitle } from '@repo/lib/utils/wrap-title'
import { FORUM_SITE_DOMAIN } from '@repo/shared/constants/origin-list'

const CollectionHead = () => {
  return (
    <Head>
      <title>{wrapTitle("Коллекции")}</title>
      <link rel="canonical" href={`${FORUM_SITE_DOMAIN}/collection`}/>
      <meta property="og:description" content="Fasberry - майнкрафт сервер" />
      <meta property="og:url" content={`${FORUM_SITE_DOMAIN}/collection`} />
    </Head>
  )
}

export function CollectionRouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full h-dvh">
      <CollectionHead/>
      <CollectionNavigation />
      <CollectionWrapper />
    </div>
  )
}