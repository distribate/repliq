"use client"

import { coverQuery } from "../queries/cover-query.ts";
import { InView } from "react-intersection-observer";
import { useCover } from "../hooks/use-cover.ts";
import { UserCoverSkeleton } from "./cover-skeleton.tsx";
import { UserCover } from "./cover.tsx";
import { requestedUserQuery } from '../queries/requested-user-query.ts';

export type UserCoverLayoutProps = {
	reqUserNickname: string,
	isBlocked: boolean
}

export const UserCoverLayout = ({
	reqUserNickname, isBlocked
}: UserCoverLayoutProps) => {
	const { data: coverQueryState } = coverQuery()
	const { setCoverStateMutation } = useCover()
	const { data: requestedUser, isLoading } = requestedUserQuery(
		reqUserNickname
	)
	
	if (typeof requestedUser === 'string') return null;
	
	const inView = coverQueryState.inView;
	
	if (isLoading) return <UserCoverSkeleton/>
	
	return (
		<>
			<InView
				as="div"
				className={`${inView ? 'h-[612px] absolute left-0 top-0 right-0' : 'h-[200px] absolute top-0'}`}
				onChange={(inView, entry) => {
					setCoverStateMutation.mutate({
						inView: inView, entry: entry
					})
				}}
			/>
			{requestedUser && <UserCover requestedUser={requestedUser} isBlocked={isBlocked}/>}
		</>
	)
}