import { ChevronDown } from "lucide-react";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { searchPageAtom, SearchPageQuery } from "#components/search/models/search-page.model";
import { reatomComponent } from "@reatom/npm-react";
import { searchTypeParamAtom } from "../models/search-related.model";

type SearchPageFilter = {
  title: string;
  value: Pick<SearchPageQuery, "type">["type"];
};

const SEARCH_PAGE_FILTER: SearchPageFilter[] = [
  { title: "По названию", value: "title" },
  { title: "По игроку", value: "user" },
];

export const SearchPageFilter = reatomComponent(({ ctx }) => {
  const searchState = ctx.spy(searchPageAtom)
  const type = ctx.spy(searchTypeParamAtom)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={type === "users"}
          className="flex cursor-pointer
            disabled:pointer-events-none items-center justify-center disabled:cursor-not-allowed rounded-md w-[40px] h-[80px]"
        >
          <ChevronDown size={32} className="icon-color disabled:opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="min-w-[180px]">
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
                  // handleSearchFilter(option.value);
                }}
              >
                <Typography state={searchState.type === option.value ? "active" : "default"}>
                  {option.title}
                </Typography>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}, "SearchPageFilter")