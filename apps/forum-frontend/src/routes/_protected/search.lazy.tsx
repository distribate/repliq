import { createLazyFileRoute } from '@tanstack/react-router'
import { SearchNavigationBadge } from '@repo/components/src/search/components/search-navigation-badge'
import { SearchPageFilter } from '@repo/components/src/search/components/search-page-filter'
import { SearchPageInput } from '@repo/components/src/search/components/search-page-input'
import { SearchPageResults } from '@repo/components/src/search/components/search-page-results'
import { useSearch } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_protected/search')({
  component: RouteComponent,
  // @ts-ignore
  head: () => ({
    meta: [
      {
        title: 'Поиск',
      },
    ],
  }),
    // @ts-ignore
  validateSearch: (params) => {
    return {
      type: (params.type as 'users' | 'threads' | 'all') || 'all',
      // queryValue: params.queryValue as string || null
    }
  },
})

function RouteComponent() {
  const searchType = useSearch({
    from: '/_protected/search',
      // @ts-ignore
    select: (params) => params.type,
  })

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="flex justify-between items-center bg-shark-950 px-6 gap-2 py-4 h-[80px] w-full rounded-lg">
        <SearchPageInput />
        <div className="w-[40px]">
          <SearchPageFilter type={searchType} />
        </div>
      </div>
      <div className="flex items-center gap-2 w-fit">
        <SearchNavigationBadge title="Все" paramValue="all" />
        <SearchNavigationBadge title="Игроки" paramValue="users" />
        <SearchNavigationBadge title="Треды" paramValue="threads" />
      </div>
      <div className="mt-4 w-full h-full">
        <SearchPageResults type={searchType} />
      </div>
    </div>
  )
}