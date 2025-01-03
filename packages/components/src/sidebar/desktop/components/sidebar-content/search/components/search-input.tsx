import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent, useState } from "react";
import { useSearchControl } from "../hooks/use-search-control.tsx";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { searchQuery } from "../queries/search-query.ts";
import Inspector from "@repo/assets/images/minecraft/block_inspect.webp";
import { SearchSort } from "./search-sort.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import Link from "next/link";

export const SearchInput = () => {
  const { setSearchQueryMutation } = useSearchControl();
  const { data: searched } = searchQuery();
  const [value, setValue] = useState<string>("");

  const updateQuery = (queryValue: string) => {
    return setSearchQueryMutation.mutate({ queryValue });
  };

  const debounceUpdateQuery = useDebounce(updateQuery, 300);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: raw } = e.target;
    let value = raw;

    if (searched.type === "users") value = raw.replace(" ", "");

    setValue(value);
    debounceUpdateQuery(value);
  };

  return (
    <>
      <Separator />
      <div className="flex bg-shark-700/80 items-center px-2 w-full justify-between rounded-md">
        <div className="flex items-center">
          <Link
            href="/search"
            className="flex items-center rounded-md w-[44px]"
          >
            <ImageWrapper
              propSrc={Inspector.src}
              propAlt="Search spyglass"
              className="w-[24px] h-[24px]"
              width={24}
              height={24}
              loading="lazy"
            />
          </Link>
          <Input
            onDrop={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            backgroundType="transparent"
            value={value}
            type="text"
            onChange={handleSearchInput}
            className="!px-0 w-full"
            placeholder="Поиск"
          />
        </div>
        <div className="flex w-fit">
          <SearchSort />
        </div>
      </div>
    </>
  );
};
