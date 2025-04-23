import { Input } from "@repo/ui/src/components/input.tsx";
import { getRouteApi, } from "@tanstack/react-router";
import { ChangeEvent, useEffect } from "react";
import { useSearchPage } from "#components/search/hooks/use-search-page.ts";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";

const searchApiRoute = getRouteApi("/_protected/search")

export const SearchPageInput = () => {
  const { type, queryValue } = searchApiRoute.useSearch()
  const { setValueMutation } = useSearchPage();

  useEffect(() => {
    setValueMutation.mutate({ queryValue });
  }, [type]);

  const updateQuery = (queryValue: string) => setValueMutation.mutate({ queryValue });
  const debounceUpdateQuery = useDebounce(updateQuery, 300);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    debounceUpdateQuery(value);
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
};