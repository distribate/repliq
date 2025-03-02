import { List } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useSearchControl } from "../hooks/use-search-control.tsx";
import { searchQuery } from "../queries/search-query.ts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { AlignJustify, LayoutGrid } from "lucide-react";
import { SORT_TYPES } from "../constants/sort-types.ts";
import { isValue } from "@repo/lib/helpers/check-is-value.ts";

export const SearchSort = () => {
  const { data: searchedState } = searchQuery();
  const { setSearchQueryMutation } = useSearchControl();

  const isSearchType = isValue(searchedState.type);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <List size={20} className="icon-color" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="min-w-[180px]">
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex flex-col gap-y-2">
            <Typography textSize="small" className="text-shark-300 px-2 pt-2">
              Фильтровать по
            </Typography>
            <div className="flex flex-col gap-y-2">
              {SORT_TYPES.map((sort) => (
                <DropdownMenuItem
                  key={sort.value}
                  className="items-center gap-1"
                  onClick={e => {
                    e.preventDefault();
                    setSearchQueryMutation.mutate({ type: sort.value });
                  }}
                >
                  <sort.icon size={16} className="icon-color" />
                  <Typography state={isSearchType(sort.value) ? "active" : "default"}>
                    {sort.title}
                  </Typography>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-y-2">
            <Typography textSize="small" className="text-shark-300 px-2 pt-2">
              Вид
            </Typography>
            <div className="flex flex-col gap-y-2">
              <DropdownMenuItem className="items-center gap-1">
                <AlignJustify size={16} className="icon-color" />
                <Typography>Список</Typography>
              </DropdownMenuItem>
              <DropdownMenuItem className="items-center gap-1">
                <LayoutGrid size={16} className="icon-color" />
                <Typography>Cетка</Typography>
              </DropdownMenuItem>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};