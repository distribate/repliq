import { ChevronDown } from "lucide-react";
import { SearchType } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { useSearchPage } from "#search/hooks/use-search-page.ts";
import { searchPageQuery, SearchPageQuery } from "#search/queries/search-page-query.ts";
import { isValue } from "@repo/lib/helpers/check-is-value.ts";

type SearchPageFilterProps = {
  type: SearchType;
};

type SearchPageFilter = {
  title: string;
  value: Pick<SearchPageQuery, "type">["type"];
};

const SEARCH_PAGE_FILTER: SearchPageFilter[] = [
  { title: "По названию", value: "title" },
  { title: "По игроку", value: "user" },
];

export const SearchPageFilter = ({ type }: SearchPageFilterProps) => {
  const { setValueMutation } = useSearchPage();
  const { data: searchState } = searchPageQuery();

  const handleSearchFilter = (t: Pick<SearchPageFilter, "value">["value"]) => setValueMutation.mutate({ type: t });

  const isSearchType = isValue(searchState.type);

  return (
    <DropdownWrapper
      properties={{
        sideAlign: "bottom",
        contentAlign: "start",
        contentClassname: "min-w-[180px]",
      }}
      trigger={
        <Button
          disabled={type === "users"}
          className="flex cursor-pointer
            disabled:pointer-events-none items-center justify-center disabled:cursor-not-allowed rounded-md w-[40px] h-[80px]"
        >
          <ChevronDown size={32} className="icon-color disabled:opacity-60"/>
        </Button>
      }
      content={
        <div className="flex flex-col gap-y-2 w-full h-full">
          <Typography textSize="small" className="text-shark-300 px-2 pt-2">
            Параметры поиска
          </Typography>
          <div className="flex flex-col gap-y-2 h-full w-full">
            {SEARCH_PAGE_FILTER.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="items-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchFilter(option.value);
                }}
              >
                <Typography state={isSearchType(option.value) ? "active" : "default"}>
                  {option.title}
                </Typography>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      }
    />
  );
};