"use client"

import { List } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { DropdownWrapper } from "../../../../wrappers/dropdown-wrapper.tsx";
import { FriendsSort as FriendsSortType, useFriendsSort } from "../hooks/use-friends-sort.tsx";
import React from "react";

type FriendsSortItems = {
	title: string,
	value: FriendsSortType
}

const FRIENDS_SORT_ITEMS: FriendsSortItems[] = [
	{
		title: "По дате добавления",
		value: "created_at"
	},
	// {
	// 	title: "По привилегии",
	// 	value: "donate"
	// }
]

export const FriendsSort = () => {
	const { setFriendsSortMUtation } = useFriendsSort()

	const handleSort = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>, type: FriendsSortType
	) => {
		e.preventDefault();
		
		setFriendsSortMUtation.mutate({
			type: type
		})
	}

	return (
		<div className="w-fit">
			<DropdownWrapper
				properties={{
					sideAlign: "bottom",
					contentAlign: "end",
					contentClassname: "w-[200px]"
				}}
				trigger={
					<div className="flex items-center gap-1">
						<Typography>
							По дате добавления
						</Typography>
						<List size={26}/>
					</div>
				}
				content={
					<div className="flex flex-col gap-y-4">
						<Typography className="text-shark-300 text-sm px-2 pt-2">
							Фильтровать по
						</Typography>
						<div className="flex flex-col gap-y-2">
							{FRIENDS_SORT_ITEMS.map((item, i) => (
								<DropdownMenuItem
									key={i}
									onClick={(e) => handleSort(e, item.value)}
								>
									<Typography>
										{item.title}
									</Typography>
								</DropdownMenuItem>
							))}
						</div>
					</div>
				}
			/>
		</div>
	)
}