import { MainLayoutPage } from "#/components/layout/main-layout";
import { Overlay } from "#/ui/overlay";
import { WrapperTitle } from "#/ui/wrapper-title";
import { Typography } from "#/ui/typography";
import { Rules as RulesList } from "#/components/rules/rules.tsx";
import { Button } from "#/ui/button";
import Link from "next/link";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { RULES_QUERY_KEY } from '#/lib/queries/rules-query.ts';
import { getRules } from '#/lib/queries/get-rules.ts';
import { Suspense } from 'react';
import { Skeleton } from '#/ui/skeleton.tsx';
import { Badge } from '#/ui/Badge.tsx';

export const metadata = {
	title: "Правила"
}

const RulesListSkeleton = () => {
	return (
		<div className="full-screen-section py-32">
			<div className="flex flex-col gap-y-10 w-[85%] mx-auto">
				<div
					className="flex flex-col md:flex-row gap-y-4 border-2 border-[#454545] hover:duration-300
					duration-300 lg:gap-y-2 py-4 p-2 rounded-[8px] justify-between"
				>
					<div className="flex items-start lg:items-center gap-x-2">
						<Typography
							title="Типа теги, чтобы было круто"
							className="text-black dark:text-white"
							size="xl"
						>
							Теги:
						</Typography>
						<div className="flex flex-wrap gap-2">
							<Badge>#правила</Badge>
							<Badge variant="destructive">#база</Badge>
							<Badge>#кодекс</Badge>
							<Badge variant="violet">#никтонечитает</Badge>
						</div>
					</div>
				</div>
				<div id="rules-list" className="flex flex-col gap-6 w-full h-full">
					<Skeleton className="h-56 w-full"/>
					<Skeleton className="h-48 w-full"/>
					<Skeleton className="h-56 w-full"/>
					<Skeleton className="h-48 w-full"/>
				</div>
			</div>
		</div>
	)
}

const Rules = async() => {
	const qc = new QueryClient();
	
	await qc.prefetchQuery({
		queryKey: RULES_QUERY_KEY,
		queryFn: () => getRules(),
	});
	
	const dehydratedState = dehydrate(qc);
	
	return (
		<HydrationBoundary state={dehydratedState}>
			<RulesList />
		</HydrationBoundary>
	);
};

export default async function RulesPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div
				className={`full-screen-section flex items-center justify-start bg-bottom md:bg-center bg-cover
						bg-[url('/images/backgrounds/rules_background.png')]`}
			>
				<Overlay variant="default" />
				<WrapperTitle>
					<div className="flex flex-col gap-6 w-full lg:max-w-3xl items-start justify-center">
						<div className="flex flex-col gap-1 lg:max-w-3xl">
							<Typography position="left" shadow="xl" className="text-5xl lg:text-6xl text-gold mb-2">
								Правила проекта
							</Typography>
							<Typography position="left" text_color="white" className="text-2xl md:text-3xl">
								Правила созданы для чего? Чтобы их не нарушать!
							</Typography>
						</div>
						<Link href="#rules-list">
							<Button
								size="default"
								variant="pageLink"
								className="hover:bg-[#8a113c] bg-[#a20f40]"
							>
								<Typography text_color="white" className="font-bold text-xl">
									<span
										className="inline-block group-hover:rotate-0 rotate-90 duration-150 group-hover:duration-150"
									>
										✎
									</span>
									&nbsp;К правилам
								</Typography>
							</Button>
						</Link>
					</div>
				</WrapperTitle>
			</div>
			<Suspense fallback={<RulesListSkeleton/>}>
				<Rules/>
			</Suspense>
		</MainLayoutPage>
	)
}