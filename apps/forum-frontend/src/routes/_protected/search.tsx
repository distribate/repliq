import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import { SearchPageInput } from '@repo/components/src/search/components/search-page-input'
import { SearchPageResults as Results } from '@repo/components/src/search/components/search-page-results'
import { availableCategoriesQuery } from '@repo/components/src/forms/create-thread/queries/available-query'
import { Typography } from '@repo/ui/src/components/typography'
import { searchPageQuery } from '@repo/components/src/search/queries/search-page-query'
import { SearchPageRelated } from '@repo/components/src/search/components/search-page-related'
import { SearchType } from '@repo/components/src/sidebar/desktop/components/sidebar-content/search/queries/search-query'
import { CATEGORY_URL } from '@repo/shared/constants/routes'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@repo/ui/src/components/select'
import { useState } from 'react'

export const Route = createFileRoute('/_protected/search')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Поиск' },
    ],
  }),
  validateSearch: (params) => {
    return {
      type: (params.type as 'users' | 'threads' | 'all') || 'all',
    }
  },
})

const SearchCategories = () => {
  const { data: categories } = availableCategoriesQuery(true)

  if (!categories) return null

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <Typography
        textSize="very_big"
        textColor="shark_white"
        className="font-semibold"
      >
        Категории
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-4 w-full h-full">
        {categories?.map(({ id, color, title, description, emoji }) => (
          <Link
            to={CATEGORY_URL + id}
            key={id}
            style={{ backgroundColor: color }}
            className="flex flex-col relative cursor-pointer h-[80px] md:aspect-video hover:bg-shark-700 w-full md:h-full p-3 lg:p-4 rounded-lg bg-shark-950"
          >
            <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
              {title}
            </Typography>
            <Typography textSize="small" textColor="shark_white" className="font-normal" >
              {description}
            </Typography>
            <img src={emoji} draggable={false} alt="" width={52} height={52} className="absolute bottom-4 right-4 rotate-[15deg]" />
          </Link>
        ))}
      </div>
    </div>
  )
}

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

const SearchPageSection = () => {
  const searchType = searchRoute.useSearch({
    select: (params) => params.type as SearchType,
  })

  const { data: searchState } = searchPageQuery()

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
        <SearchCategories />
        <SearchPageRelated />
      </>
    )
  )
}

function RouteComponent() {
  return (
    <div className="flex flex-col gap-y-4 w-full min-h-dvh h-full">
      <div className="flex justify-between items-center bg-shark-950 px-6 gap-2 py-4 h-[80px] w-full rounded-lg">
        <SearchPageInput />
      </div>
      <SearchPageSection />
    </div>
  )
}