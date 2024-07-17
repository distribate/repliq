"use client"

import { useEffect, useRef, useState } from "react";
import { Typography } from "@repo/ui/src/components/typography";
import { useRouter } from "next/navigation"

type UserNotExistCounterProps = {
	redirectTimeout: string,
	redirectUser: string
}

export const UserNotExistCounter = ({
	redirectTimeout, redirectUser
}: UserNotExistCounterProps) => {
	const [seconds, setSeconds] = useState<number>(
		parseInt(redirectTimeout)
	);
	
	const { push } = useRouter();
	const timerIdRef = useRef<NodeJS.Timeout | null>(null);
	
	useEffect(() => {
		if (!seconds) {
			push(`/user/${redirectUser}`);
			
			return;
		}
		
		timerIdRef.current = setInterval(() => {
			setSeconds(prevSeconds => {
				if (prevSeconds <= 1) {
					clearInterval(timerIdRef.current!);
					
					push(`/user/${redirectUser}`);
					return 0;
				}
				return prevSeconds - 1;
			});
		}, 1000);
		
		return () => {
			if (timerIdRef.current) {
				clearInterval(timerIdRef.current);
			}
		};
	}, [seconds, push, redirectUser]);
	
	if (!redirectUser || !redirectTimeout) return;
	
	return (
		<div className="flex flex-col">
			<Typography>
				{seconds} секунд до редиректа на ваш профиль...
			</Typography>
		</div>
	)
}