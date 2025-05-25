import { Input } from "@repo/ui/src/components/input.tsx";
import { getRouteApi, } from "@tanstack/react-router";
import { ChangeEvent, useEffect } from "react";
import { searchValueAction, SyncParams } from "#components/search/hooks/use-search-page.ts";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { reatomComponent } from "@reatom/npm-react";

const searchApiRoute = getRouteApi("/_protected/search")

const PageInput = reatomComponent(({ ctx }) => {
  const { type, queryValue } = searchApiRoute.useSearch()

  useEffect(() => {
    searchValueAction(ctx, { queryValue });
  }, [type]);

  const updateQuery = (queryValue: string) => searchValueAction(ctx, { queryValue });
  const debounceUpdateQuery = useDebounce(updateQuery, 300);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debounceUpdateQuery(e.target.value);
  };

  return (
    <Input
      value={queryValue}
      placeholder={`Введите ${type === "users" ? "никнейм" : "название треда"}`}
      className="w-full h-[80px] !p-0 !rounded-md text-xl"
      backgroundType="transparent"
      onChange={handleSearch}
    />
  );
}, "SearchPageInput")

export const SearchPageInput = () => {
  return (
    <>
      <SyncParams />
      <PageInput />
    </>
  )
}