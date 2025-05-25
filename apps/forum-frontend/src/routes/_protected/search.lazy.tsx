import { createLazyFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import { SearchPageInput } from '#components/search/components/search-page-input'
import { SearchPageResults as Results } from '#components/search/components/search-page-results'
import { availableCategoriesResource } from '#components/forms/create-thread/models/available-categories.model'
import { Typography } from '@repo/ui/src/components/typography'
import { searchPageAtom } from '#components/search/queries/search-page-query'
import { SearchRelatedThreads, SearchRelatedUsers } from '#components/search/components/search-page-related'
import { CATEGORY_URL } from '@repo/shared/constants/routes'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@repo/ui/src/components/select'
import { useState } from 'react'
import { Search } from "lucide-react"
import { reatomComponent } from '@reatom/npm-react'

type SearchParams = {
  queryValue?: string,
  type?: 'users' | 'threads' | 'all'
}

export const Route = createLazyFileRoute('/_protected/search')({
  component: RouteComponent,
  // @ts-ignore
  head: () => ({
    meta: [
      { title: 'Поиск' },
    ],
  }),
  // @ts-ignore
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    type: search.type as SearchParams["type"] ?? 'all',
    queryValue: search.queryValue as string | undefined ?? undefined
  })
})

const SearchCategories = reatomComponent(({ ctx }) => {
  const categories = ctx.spy(availableCategoriesResource.dataAtom)

  if (!categories) return null

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
        Категории
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-4 w-full h-full">
        {categories?.map(({ id, color, title, emoji }) => (
          <Link
            to={CATEGORY_URL + id}
            key={id}
            style={{ backgroundColor: color }}
            className="flex flex-col relative cursor-pointer h-[80px] md:aspect-video hover:bg-shark-700 w-full md:h-full p-3 lg:p-4 rounded-lg bg-shark-950"
          >
            <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
              {title}
            </Typography>
            <img src={emoji} draggable={false} alt="" width={52} height={52} className="absolute bottom-4 right-4 rotate-[15deg]" />
          </Link>
        ))}
      </div>
    </div>
  )
}, "SearchCategories")

const searchRoute = getRouteApi('/_protected/search')

const SearchPageFiltration = () => {
  const [type, setType] = useState<'users' | 'threads' | 'all'>('all')

  return (
    <div className="flex flex-col gap-4 w-1/4 h-full p-4 bg-shark-950 rounded-lg border border-shark-800">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Фильтрация
      </Typography>
      <div className="flex flex-col gap-2 w-full h-full">
        <div className="flex flex-col items-start gap-2 border border-shark-700 rounded-md p-2 w-full">
          <Typography textSize="large">
            Кого ищем?
          </Typography>
          <Select defaultValue='all' value={type} onValueChange={v => setType(v as 'users' | 'threads' | 'all')}>
            <SelectTrigger className="p-0">
              <Typography textSize="medium">
                {type === 'all' ? 'Все' : type}
              </Typography>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">
                <Typography textSize="medium">
                  Пользователи
                </Typography>
              </SelectItem>
              <SelectItem value="threads">
                <Typography textSize="medium">
                  Темы
                </Typography>
              </SelectItem>
              <SelectItem value="all">
                <Typography textSize="medium">
                  Все
                </Typography>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

const SearchPageSection = reatomComponent(({ ctx }) => {
  const searchType = searchRoute.useSearch({ select: params => params.type })
  const searchState = ctx.spy(searchPageAtom)

  return (
    searchState.queryValue ? (
      <div className="flex relative items-start gap-4 w-full h-full">
        <div className="flex flex-col bg-shark-950 p-4 border border-shark-800 rounded-lg gap-y-4 w-3/4 h-full">
          <Typography textSize="big" textColor="shark_white" className="font-semibold">
            Результаты поиска
          </Typography>
          <Results type={searchType} />
        </div>
        <SearchPageFiltration />
      </div>
    ) : (
      <>
        {searchType === 'threads' && <SearchCategories />}
        <div className="flex flex-col gap-y-8 w-full h-full">
          {searchType === 'users' && <SearchRelatedUsers />}
          {searchType === 'threads' && <SearchRelatedThreads />}
        </div>
      </>
    )
  )
}, "SearchPageSection")

function RouteComponent() {
  return (
    <div className="flex flex-col gap-y-4 w-full min-h-dvh h-full p-1">
      <div
        className="flex justify-between items-center duration-300 ease-in-out transtion-all bg-shark-950 outline-none 
          focus-within:outline focus-within:outline-2 focus-within:outline-biloba-flower-500 px-4 gap-3 py-4 h-[80px] w-full rounded-lg"
      >
        <Search size={24} className="text-shark-300" />
        <SearchPageInput />
      </div>
      <SearchPageSection />
    </div>
  )
}