"use client"

import { useSaveLastThread } from "../../saved-thread/hooks/use-save-last-thread.tsx";
import Link from "next/link";
import { SavedThreadType } from "../../saved-thread/types/saved-thread-types.ts";
import { ReactNode } from "react";
import { THREAD_URL } from '@repo/shared/constants/routes.ts';

type TopicLayoutProps = SavedThreadType & {
	children: ReactNode
}

export const ThreadLayout = ({
	id, nickname, title, children
}: TopicLayoutProps) => {
	const { saveThread } = useSaveLastThread()
	
	return (
		<Link
			href={THREAD_URL + id}
			onClick={() => saveThread({ title, nickname, id })}
		>
			{children}
		</Link>
	)
}