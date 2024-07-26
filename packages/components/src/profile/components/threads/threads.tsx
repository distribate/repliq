"use client"

import { UserPageParam } from "@repo/types/config/page-types.ts"
import { threadsQuery } from "./queries/threads-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "dayjs";
import { ArrowUp } from 'lucide-react';
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { MessageSquare, MessageSquareOff } from 'lucide-react';
import Link from "next/link";
import { ArrowUpRight } from 'lucide-react';
import { ThreadsSkeleton } from "./components/threads-skeleton.tsx";
import { ProfileTopicsNotFound } from "../../../templates/topics-not-found.tsx";
import { THREAD_URL } from '@repo/shared/constants/routes.ts';

export const UserTopics = ({
	nickname
}: UserPageParam) => {
	const { data: userTopics, isLoading } = threadsQuery(nickname);
	
	if (isLoading) return <ThreadsSkeleton/>
	
	if (userTopics && !userTopics.length) {
		return <ProfileTopicsNotFound/>
	}
	
	return (
		<div className="flex flex-col w-full gap-6">
			<div className="flex items-center gap-2 py-2 px-4">
				Треды
			</div>
			<Separator orientation="horizontal" />
			<div className="flex flex-col gap-y-2 overflow-hidden px-2 py-2">
				{userTopics?.map((topic, i) => (
					<div
						key={i}
						className="flex items-center py-2 px-2 hover:bg-white/10 rounded-md transition-all ease-in hover:duration-150 justify-between"
					>
						<div className="flex flex-col gap-y-1 w-full">
							<div className="w-1/2">
								<Link href={THREAD_URL + topic.id}>
									<Typography textColor="shark_white" className="text-md font-normal truncate">
										{topic.title}
									</Typography>
								</Link>
							</div>
							<div className="flex items-center gap-2">
								{topic.comments ? (
									<div className="flex items-center gap-1">
										<Typography className="text-sm text-shark-50">0</Typography>
										<MessageSquare size={16} className="text-shark-300 font-normal text-sm" />
									</div>
								) : <MessageSquareOff size={16} className="text-red-300 text-sm font-normal" />}
								<Separator orientation="vertical" />
								<div className="flex items-center gap-1">
									<Typography className="text-sm text-shark-50">0</Typography>
									<ArrowUp size={16} className="text-shark-300 font-normal text-sm" />
								</div>
								<Separator orientation="vertical" />
								<Typography className="text-shark-300 text-sm font-normal">
									{dayjs(topic.created_at).format("DD.MM.YY HH:mm")}
								</Typography>
							</div>
						</div>
						<Link href={THREAD_URL + topic.id}>
							<ArrowUpRight
								size={24}
								className="hover:text-pink-300 text-shark-300 hover:rotate-45 transition-all ease-in duration-150"
							/>
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}