import { WrapperTitle } from "#/ui/wrapper-title";
import { Overlay } from "#/ui/overlay";
import { MainLayoutPage } from "#/components/layout/main-layout";
import { Typography } from "#/ui/typography";
import Link from "next/link";
import { Button } from "#/ui/button";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { DONATES_QUERY_KEY } from '#/lib/queries/donates-query.ts';
import { getDonates } from '#/lib/queries/get-donates.ts';
import { Suspense } from 'react';
import { Skeleton } from '#/ui/skeleton.tsx';
import { DonateList } from '#/components/subs/donate-list.tsx';

export const metadata = {
	title: "Донат"
}

const Donates = async () => {
	const qc = new QueryClient()
	
	await qc.prefetchQuery({
		queryKey: DONATES_QUERY_KEY,
		queryFn: () => getDonates()
	})
	
	const dehydratedState = dehydrate(qc)
	
	return (
		<HydrationBoundary state={dehydratedState}>
			<DonateList/>
		</HydrationBoundary>
	)
}

export default async function DonatePage() {
	return (
		<MainLayoutPage variant="with_section">
			<div
				className="full-screen-section flex items-center justify-start bg-bottom md:bg-center overflow-hidden bg-no-repeat bg-cover
					bg-[url('/images/backgrounds/donate_background.png')]"
			>
				<Overlay variant="default" />
				<WrapperTitle>
					<div className="flex flex-col gap-6 items-start justify-center w-full lg:max-w-3xl">
						<div className="flex flex-col gap-1 w-full lg:max-w-3xl">
							<Typography position="left" className="text-5xl lg:text-6xl text-gold mb-2">
								Покупка привилегий
							</Typography>
							<Typography position="left" text_color="white" className="text-2xl md:text-3xl">
								Здесь можно купить привилегии, ну или узнать о каждой больше.
							</Typography>
						</div>
						<Link href="#donate-list">
							<Button
								size="default"
								variant="pageLink"
								className="hover:bg-[#731c6c] bg-[#8c1c85]"
							>
								<Typography text_color="white" className="font-bold text-xl">
									<span
										className="inline-block group-hover:rotate-0 rotate-90 duration-150 group-hover:duration-150"
									>
										⭐
									</span>
									&nbsp;К привилегиям
								</Typography>
							</Button>
						</Link>
					</div>
				</WrapperTitle>
			</div>
			<div className="full-screen-section flex flex-col min-h-screen items-center">
				<div
					id="donate-list"
					className="flex flex-col py-32 responsive mx-auto"
				>
					<div className="flex flex-col items-center justify-center mb-6">
						<Typography text_color="black" position="center" variant="block_title">
							Привилегии сервера
						</Typography>
						<Typography size="xl" position="center" className="text-dark-red dark:text-gold">
							привилегии и всё, что с ними связано
						</Typography>
					</div>
					<div className="flex flex-col">
						<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
							<Suspense fallback={<Skeleton className="h-48 w-full"/>}>
								<Donates/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</MainLayoutPage>
	)
}