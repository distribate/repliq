"use client"

import { Input } from "@repo/ui/src/components/input.tsx";
import { useFriendsSort } from "../hooks/use-friends-sort.tsx";
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";

type FriendsFilteringProps = {
	nickname: string
}

export const FriendsSearch = () => {
	const [ value, setValue ] = useState("")
	const { setFriendsSortMUtation } = useFriendsSort()

	const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
		setFriendsSortMUtation.mutate({ search: val })
	}, 100), []);
	
	const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		
		setValue(value)
		debouncedHandleSearch(value)
	}
	
	return (
		<div className="flex w-fit">
			<Input
				className="rounded-md"
				value={value}
				placeholder="Поиск по нику"
				onChange={handleSearchInput}
			/>
		</div>
	)
}