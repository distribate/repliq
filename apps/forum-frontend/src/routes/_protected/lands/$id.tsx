import { createFileRoute } from '@tanstack/react-router'
import { landAtom, landParamAtom } from '#components/land/models/land.model'
import { reatomLoader } from '@repo/lib/utils/reatom-loader'
import { take } from '@reatom/framework'
import { Land } from '#components/land/components/land'

export const Route = createFileRoute('/_protected/lands/$id')({
  component: RouteComponent,
  loader: reatomLoader(async (context, { params }) => {
    landParamAtom(context, params.id as string)

    let data = context.get(landAtom)

    if (!data) {
      data = await take(context, landAtom)
    }

    return {
      title: data ? data?.name : 'Не найдено...',
    }
  }),
  head: ({ loaderData }) => {
    const data = loaderData as { title: string | undefined }

    return {
      meta: [{ title: data?.title ?? "Загрузка..." }],
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex items-start gap-4 w-full h-screen">
      <Land />
    </div>
  )
}