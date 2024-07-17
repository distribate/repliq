import { Metadata } from "next";
import { MetadataType } from "@repo/types/config/page-types.ts"
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getRandomMinecraftFact } from "@repo/components/src/forms/auth/queries/get-random-minecraft-fact.ts";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const generateMetadata = ({
	searchParams
}: MetadataType): Metadata => {
	const { type } = searchParams;
	
	const title = type === 'login'
		? 'Вход'
		: type === 'register'
			? 'Регистрация'
			: 'Вход';
	
	return {
		title: title
	}
}

export default async function AuthPage() {
	const fact = await getRandomMinecraftFact()
	
	return (
		<Suspense fallback={
			<Skeleton className="bg-shark-300 rounded-md max-w-[1020px] h-6"/>
		}>
			{fact && (
				<div
					className="flex bg-shark-300 font-[Minecraft] gap-1 relative rounded-md w-full items-start py-2 px-8 animate-fadein overflow-x-scroll max-w-[1020px]">
					<Typography className="text-shark-800 text-base font-semibold">
						Факт:
					</Typography>
					<Typography className="text-shark-800 text-base font-medium whitespace-normal">
						{fact.fact.toString()}
					</Typography>
				</div>
			)}
		</Suspense>
	)
}