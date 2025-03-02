import { Input } from "@repo/ui/src/components/input.tsx";
import { useLocation } from "@tanstack/react-router";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchPage } from "#components/search/hooks/use-search-page.ts";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { SearchType } from "#components/sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";

export const SearchPageInput = () => {
  const { search: searchParams } = useLocation()

  const paramQueryValue = searchParams.queryValue
  const searchType = searchParams.type as SearchType ?? "all";
  const [value, setValue] = useState<string>(paramQueryValue || "");
  const { setValueMutation } = useSearchPage();

  useEffect(() => {
    setValueMutation.mutate({ queryValue: value });
  }, [searchType]);

  const updateQuery = (queryValue: string) => setValueMutation.mutate({ queryValue });
  const debounceUpdateQuery = useDebounce(updateQuery, 300);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
    debounceUpdateQuery(value);
  };

  return (
    <Input
      value={value}
      placeholder={`Введите ${searchType === "users" ? "никнейм" : "название треда"}`}
      className="w-full h-[80px] !p-0 !rounded-md text-xl"
      backgroundType="transparent"
      onChange={handleSearch}
    />
  );
};