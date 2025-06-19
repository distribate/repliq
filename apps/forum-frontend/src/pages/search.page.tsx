import { SearchPageInput } from '#components/search/components/search-page-input'
import { SearchPageResults as Results } from '#components/search/components/search-page-results'
import { Typography } from '@repo/ui/src/components/typography'
import { searchPageQueryAtom, searchPageQueryParamsAtom, SearchPageType, searchPageTypeAtom } from '#components/search/models/search-page.model'
import { SearchPageRelated } from '#components/search/components/search-page-related'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@repo/ui/src/components/select'
import { Search } from "lucide-react"
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { SearchPageHistory } from '#components/search/components/search-history'
import { Head } from '@unhead/react'
import { wrapTitle } from '@repo/lib/utils/wrap-title'
import { searchRoute } from '#routes/protected-routes'

export type Params = {
  query?: string,
}

const SearchPageFiltration = reatomComponent(({ ctx }) => {
  const type = ctx.spy(searchPageTypeAtom)

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
          <Select
            defaultValue='users'
            value={type}
            onValueChange={value => searchPageTypeAtom(ctx, value as SearchPageType)}
          >
            <SelectTrigger className="p-0">
              <Typography textSize="medium">
                {type}
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
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}, "SearchPageFiltration")

const SearchPageSection = reatomComponent(({ ctx }) => {
  const query = ctx.spy(searchPageQueryAtom)

  if (!query) return (
    <>
      <SearchPageHistory />
      <SearchPageRelated />
    </>
  )

  return (
    <div className="flex relative items-start gap-4 w-full h-full">
      <div className="flex flex-col bg-shark-950 p-4 border border-shark-800 rounded-lg gap-y-4 w-3/4 h-full">
        <Typography textSize="big" textColor="shark_white" className="font-semibold">
          Результаты поиска
        </Typography>
        <Results />
      </div>
      <SearchPageFiltration />
    </div>
  )
}, "SearchPageSection")

const SearchHead = reatomComponent(({ ctx }) => {
  const target = ctx.spy(searchPageTypeAtom)
  const type = target === 'threads' ? "тредов" : target === 'users' ? "игроков" : ""

  return (
    <Head>
      <title>{wrapTitle(`Поиск ${type}`)}</title>
      <link rel="canonical" href="https://hub.fasberry.su/auth" />
      <meta property="og:description" content="Fasberry - майнкрафт сервер" />
      <meta property="og:url" content="https://hub.fasberry.su/auth" />
      <meta property="og:image" content="https://kong.fasberry.su/storage/v1/object/public/static/auth_background/4.png" />
    </Head>
  )
}, "SearchHead")

const SyncSearchParams = () => {
  const {query } = searchRoute.useSearch()
  useUpdate((ctx) => searchPageQueryParamsAtom(ctx, { query }), [])
  return null;
}

export function SearchRouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full min-h-dvh h-full p-1">
      <SyncSearchParams/>
      <SearchHead />
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