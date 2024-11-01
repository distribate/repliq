"use client"

import { donateQuery } from "../queries/donate-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserDonate as UserDonateType } from "../types/user-donate-types.ts";
import { DonateType } from "../queries/get-user-donate.ts";
import { DONATE_GROUPS } from "../constants/donate-aliases.ts";
import { HoverCardWrapper } from '#wrappers/hover-card-wrapper.tsx';
import { ParticleEffect } from "@repo/ui/src/components/particle-effect.tsx";
import Link from "next/link";
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { UserDonateBadge } from './donate-badge.tsx';

const getDonateTitle = (donate: DonateType["primary_group"]) =>
	DONATE_GROUPS[donate]

export const UserDonate = ({
	nickname
}: UserDonateType) => {
	const { data: donate, isLoading } = donateQuery({
		nickname
	})
	
	if (isLoading) return <Skeleton className="h-5 rounded-md w-24"/>;
	if (!donate) return;
	
	const title = getDonateTitle(donate.donate);
	const favoriteItemImage = donate.favoriteItemImage?.image
	
	return (
		<HoverCardWrapper
			properties={{ delay: 1000, contentAlign: "center", sideAlign: "right" }}
			trigger={
				favoriteItemImage ? (
					<ParticleEffect options={{ particle: favoriteItemImage, }}>
						<UserDonateBadge variant={donate.donate}>
							<Typography textColor="shark_white" className="font-[Minecraft] text-[12px]">
								{title}
							</Typography>
						</UserDonateBadge>
					</ParticleEffect>
				) : (
					<UserDonateBadge variant={donate.donate}>
						<Typography textColor="shark_white" className="font-[Minecraft] text-[12px]">
							{title}
						</Typography>
					</UserDonateBadge>
				)
			}
			content={
				<div className="flex flex-col gap-y-2 w-full p-2">
					<Typography textSize="small" textColor="shark_white">
						Привилегии дают доступ к большим возможностям на форуме и в самой игре.
					</Typography>
					<Typography textSize="small" textColor="shark_white">
						подробнее см.&nbsp;
						<Link href={`/misc/donate`} className="text-caribbean-green-500 text-sm">
							привилегии
						</Link>
					</Typography>
				</div>
			}
		/>
	)
}