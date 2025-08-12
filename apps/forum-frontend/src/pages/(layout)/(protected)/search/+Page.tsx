import { SearchInput } from '#components/search/components/search-page-input'
import { SearchPageResults as Results } from '#components/search/components/search-page-results'
import { Typography } from '@repo/ui/src/components/typography'
import { searchPageQueryAtom, SearchPageType, searchPageTypeAtom } from '#components/search/models/search-page.model'
import { SearchPageRelated } from '#components/search/components/search-page-related'
import { Search } from "lucide-react"
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { SearchPageHistory } from '#components/search/components/search-history'
import { usePageContext } from 'vike-react/usePageContext'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@repo/ui/src/components/sheet'
import { IconX } from '@tabler/icons-react'
import { Separator } from '@repo/ui/src/components/separator'

const FILTER_TYPES: { title: string, value: SearchPageType }[] = [
  { title: "Все", value: "all" },
  { title: "Люди", value: "users" },
  { title: "Треды", value: "threads" }
] as const;

const SearchFilterType = reatomComponent<{ filter: typeof FILTER_TYPES[number] }>(({ ctx, filter }) => {
  const current = ctx.spy(searchPageTypeAtom);
  const state = filter.value === current ? "active" : "inactive"

  const handle = () => {
    searchPageTypeAtom(ctx, filter.value)
  }

  return (
    <div
      data-state={state}
      className="flex group select-none data-[state=active]:bg-shark-200 rounded-lg px-4 py-2"
      onClick={handle}
    >
      <Typography
        className="font-semibold text-lg 
          group-data-[state=active]:text-shark-950 group-data-[state=inactive]:text-shark-50"
      >
        {filter.title}
      </Typography>
    </div>
  )
}, "SearchFilterType")

const SearchPageFiltrationUsers = () => {
  return (
    FILTER_TYPES.map((filter) => (
      <SearchFilterType key={filter.value} filter={filter} />
    ))
  )
}

const SearchFiltration = () => {
  return (
    <div className="flex flex-col gap-4 w-full order-first sm:order-last sm:w-1/4 h-full">
      <div className="sm:hidden block">
        <Sheet>
          <SheetTrigger>
            <Typography className="text-xl font-semibold">
              Показать фильтры
            </Typography>
          </SheetTrigger>
          <SheetContent withClose={false} side="bottom" className="flex flex-col min-h-24 rounded-t-lg p-4 gap-4 w-full">
            <SheetTitle className="hidden">Фильтры</SheetTitle>
            <div className="flex items-center gap-2 ">
              <SheetClose>
                <IconX size={28} />
              </SheetClose>
              <Typography className="font-semibold leading-5 text-xl">
                Фильтры
              </Typography>
            </div>
            <Separator />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 w-full h-full">
                <SearchPageFiltrationUsers />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden sm:block">
        <div className="flex flex-col gap-2 w-full h-full p-4 bg-shark-950 rounded-xl">
          <SearchPageFiltrationUsers />
        </div>
      </div>
    </div>
  )
}

const SearchRelated = () => {
  return (
    <>
      <SearchPageHistory />
      <SearchPageRelated />
    </>
  )
}

const SearchSection = reatomComponent(({ ctx }) => {
  const query = ctx.spy(searchPageQueryAtom)
  if (!query) return <SearchRelated />

  return (
    <div className="flex sm:flex-row flex-col relative items-start gap-4 w-full h-full">
      <div className="flex flex-col bg-shark-950 p-4 rounded-xl gap-4 w-full sm:w-3/4 h-full">
        <Typography textSize="big" textColor="shark_white" className="font-semibold">
          Результаты поиска
        </Typography>
        <Results />
      </div>
      <SearchFiltration />
    </div>
  )
}, "SearchPageSection")

const SyncSearchParams = () => {
  const { query } = usePageContext().urlParsed.search;
  useUpdate((ctx) => searchPageQueryAtom(ctx, query ?? ""), [])
  return null;
}

export default function SearchRouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full min-h-dvh h-full p-1">
      <SyncSearchParams />
      <div
        className="flex justify-between items-center duration-300 ease-in-out transtion-all bg-shark-950 outline-none 
          focus-within:outline focus-within:outline-2 focus-within:outline-biloba-flower-500 px-4 gap-3 py-4 h-[80px] w-full rounded-lg"
      >
        <Search size={24} className="text-shark-300" />
        <SearchInput />
      </div>
      <SearchSection />
    </div>
  )
}